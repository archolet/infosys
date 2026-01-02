using System.Net;
using InfoSystem.Core.Application.Pipelines.Caching;
using StackExchange.Redis;

namespace Infrastructure.Adapters.Caching;

public class RedisCacheManager : ICacheManager
{
    private readonly IConnectionMultiplexer _connectionMultiplexer;

    public RedisCacheManager(IConnectionMultiplexer connectionMultiplexer)
    {
        _connectionMultiplexer = connectionMultiplexer;
    }

    public async Task<List<string>> GetKeysAsync(string pattern = "*")
    {
        var keys = new List<string>();
        foreach (var endpoint in _connectionMultiplexer.GetEndPoints())
        {
            var server = _connectionMultiplexer.GetServer(endpoint);
            // IServer.Keys automatically uses SCAN
            await foreach (var key in server.KeysAsync(pattern: pattern))
            {
                keys.Add(key.ToString());
            }
        }
        return keys.Distinct().ToList();
    }

    public async Task RemoveKeyAsync(string key)
    {
        var db = _connectionMultiplexer.GetDatabase();
        await db.KeyDeleteAsync(key);
    }

    public async Task RemoveByPatternAsync(string pattern)
    {
        var keysToRemove = await GetKeysAsync(pattern);
        var db = _connectionMultiplexer.GetDatabase();

        // Remove in batches to avoid blocking too much, though KeyDeleteAsync takes an array
        // converting to RedisKey[]
        var redisKeys = keysToRemove.Select(k => (RedisKey)k).ToArray();

        if (redisKeys.Any())
        {
             await db.KeyDeleteAsync(redisKeys);
        }
    }

    public async Task FlushDatabaseAsync()
    {
        foreach (var endpoint in _connectionMultiplexer.GetEndPoints())
        {
            var server = _connectionMultiplexer.GetServer(endpoint);
            await server.FlushDatabaseAsync();
        }
    }
}
