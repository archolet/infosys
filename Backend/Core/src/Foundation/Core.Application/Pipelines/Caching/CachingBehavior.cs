using System.IO.Compression;
using System.Text;
using System.Text.Json;
using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace InfoSystem.Core.Application.Pipelines.Caching;

public class CachingBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>, ICachableRequest
{
    private readonly IDistributedCache _cache;
    private readonly CacheSettings _cacheSettings;
    private readonly ILogger<CachingBehavior<TRequest, TResponse>> _logger;

    public CachingBehavior(
        IDistributedCache cache,
        ILogger<CachingBehavior<TRequest, TResponse>> logger,
        IConfiguration configuration
    )
    {
        _cache = cache;
        _logger = logger;
        _cacheSettings = configuration.GetSection("CacheSettings").Get<CacheSettings>() ?? throw new InvalidOperationException();
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken
    )
    {
        if (request.BypassCache)
            return await next();

        byte[]? cachedResponse = null;

        if (_cacheSettings.EnableResilience)
        {
            try
            {
                cachedResponse = await _cache.GetAsync(request.CacheKey, cancellationToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Redis connection failed for key {request.CacheKey}. Proceeding to Database.");
                // Fallback to next() is implicit if cachedResponse is null
            }
        }
        else
        {
            cachedResponse = await _cache.GetAsync(request.CacheKey, cancellationToken);
        }

        if (cachedResponse != null)
        {
            try
            {
                if (_cacheSettings.EnableCompression)
                {
                    cachedResponse = await DecompressAsync(cachedResponse);
                }

                var response = JsonSerializer.Deserialize<TResponse>(Encoding.Default.GetString(cachedResponse));
                if (response != null)
                {
                    _logger.LogInformation($"Fetched from Cache -> {request.CacheKey}");
                    return response;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Serialization/Decompression error for key {request.CacheKey}. Proceeding to Database.");
            }
        }

        return await getResponseAndAddToCache(request, next, cancellationToken);
    }

    private async Task<TResponse> getResponseAndAddToCache(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken
    )
    {
        TResponse response = await next();

        try
        {
            TimeSpan slidingExpiration = request.SlidingExpiration ?? TimeSpan.FromDays(_cacheSettings.SlidingExpiration);
            DistributedCacheEntryOptions cacheOptions = new() { SlidingExpiration = slidingExpiration };

            byte[] serializeData = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(response));

            if (_cacheSettings.EnableCompression)
            {
                serializeData = await CompressAsync(serializeData);
            }

            if (_cacheSettings.EnableResilience)
            {
                try
                {
                    await _cache.SetAsync(request.CacheKey, serializeData, cacheOptions, cancellationToken);
                    _logger.LogInformation($"Added to Cache -> {request.CacheKey}");

                    if (request.CacheGroupKey != null)
                        await addCacheKeyToGroup(request, slidingExpiration, cancellationToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, $"Redis SetAsync failed for key {request.CacheKey}.");
                }
            }
            else
            {
                await _cache.SetAsync(request.CacheKey, serializeData, cacheOptions, cancellationToken);
                _logger.LogInformation($"Added to Cache -> {request.CacheKey}");

                if (request.CacheGroupKey != null)
                    await addCacheKeyToGroup(request, slidingExpiration, cancellationToken);
            }
        }
        catch (Exception ex)
        {
             _logger.LogError(ex, "Error in getResponseAndAddToCache");
        }

        return response;
    }

    private async Task addCacheKeyToGroup(TRequest request, TimeSpan slidingExpiration, CancellationToken cancellationToken)
    {
        // Group logic should also be wrapped if it wasn't already inside the caller's try-catch (which it is now)
        // But let's be safer and assume this might be called independently later or refactored.
        // For now, it relies on the caller's catch block in getResponseAndAddToCache.

        byte[]? cacheGroupCache = await _cache.GetAsync(key: request.CacheGroupKey!, cancellationToken);
        HashSet<string> cacheKeysInGroup;

        if (cacheGroupCache != null)
        {
             // Group cache might not be compressed to keep it simple, or we can compress it too.
             // Given it's a list of keys, compression might be overkill but consistent.
             // Let's keep group keys uncompressed for easier debugging/atomicity unless we standardize everything.
             // Mixing compressed/uncompressed requires metadata.
             // Strategy: ONLY compress the Data response, not the internal management keys (groups).

            cacheKeysInGroup = JsonSerializer.Deserialize<HashSet<string>>(Encoding.Default.GetString(cacheGroupCache))!;
            if (!cacheKeysInGroup.Contains(request.CacheKey))
                cacheKeysInGroup.Add(request.CacheKey);
        }
        else
            cacheKeysInGroup = new HashSet<string>(new[] { request.CacheKey });

        byte[] newCacheGroupCache = JsonSerializer.SerializeToUtf8Bytes(cacheKeysInGroup);

        byte[]? cacheGroupCacheSlidingExpirationCache = await _cache.GetAsync(
            key: $"{request.CacheGroupKey}SlidingExpiration",
            cancellationToken
        );

        int? cacheGroupCacheSlidingExpirationValue = null;
        if (cacheGroupCacheSlidingExpirationCache != null)
            cacheGroupCacheSlidingExpirationValue = Convert.ToInt32(
                Encoding.Default.GetString(cacheGroupCacheSlidingExpirationCache)
            );

        if (
            cacheGroupCacheSlidingExpirationValue == null
            || slidingExpiration.TotalSeconds > cacheGroupCacheSlidingExpirationValue
        )
            cacheGroupCacheSlidingExpirationValue = Convert.ToInt32(slidingExpiration.TotalSeconds);

        byte[] serializeCachedGroupSlidingExpirationData = JsonSerializer.SerializeToUtf8Bytes(
            cacheGroupCacheSlidingExpirationValue
        );

        DistributedCacheEntryOptions cacheOptions =
            new() { SlidingExpiration = TimeSpan.FromSeconds(Convert.ToDouble(cacheGroupCacheSlidingExpirationValue)) };

        await _cache.SetAsync(key: request.CacheGroupKey!, newCacheGroupCache, cacheOptions, cancellationToken);
        _logger.LogInformation($"Added to Cache -> {request.CacheGroupKey}");

        await _cache.SetAsync(
            key: $"{request.CacheGroupKey}SlidingExpiration",
            serializeCachedGroupSlidingExpirationData,
            cacheOptions,
            cancellationToken
        );
        _logger.LogInformation($"Added to Cache -> {request.CacheGroupKey}SlidingExpiration");
    }

    private async Task<byte[]> CompressAsync(byte[] data)
    {
        using var outputStream = new MemoryStream();
        using (var gzipStream = new GZipStream(outputStream, CompressionMode.Compress))
        {
            await gzipStream.WriteAsync(data, 0, data.Length);
        }
        return outputStream.ToArray();
    }

    private async Task<byte[]> DecompressAsync(byte[] compressedData)
    {
        using var inputStream = new MemoryStream(compressedData);
        using var gzipStream = new GZipStream(inputStream, CompressionMode.Decompress);
        using var outputStream = new MemoryStream();
        await gzipStream.CopyToAsync(outputStream);
        return outputStream.ToArray();
    }
}
