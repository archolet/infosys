namespace InfoSystem.Core.Application.Pipelines.Caching;

public class CacheSettings
{
    public int SlidingExpiration { get; set; }
    public bool EnableCompression { get; set; } = true;
    public bool EnableResilience { get; set; } = true;
}
