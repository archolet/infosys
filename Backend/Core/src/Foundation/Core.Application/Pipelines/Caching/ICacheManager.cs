namespace InfoSystem.Core.Application.Pipelines.Caching;

public interface ICacheManager
{
    Task<List<string>> GetKeysAsync(string pattern = "*");
    Task RemoveKeyAsync(string key);
    Task RemoveByPatternAsync(string pattern);
    Task FlushDatabaseAsync();
}
