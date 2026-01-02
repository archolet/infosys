using InfoSystem.Core.Application.Pipelines.Caching;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
// [Authorize(Roles = "Admin")] // Uncomment for production
public class CacheController : ControllerBase
{
    private readonly ICacheManager _cacheManager;

    public CacheController(ICacheManager cacheManager)
    {
        _cacheManager = cacheManager;
    }

    [HttpGet("keys")]
    public async Task<IActionResult> GetKeys([FromQuery] string pattern = "*")
    {
        try
        {
            var keys = await _cacheManager.GetKeysAsync(pattern);
            return Ok(keys);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = "Redis connection failed or not configured.", Details = ex.Message });
        }
    }

    [HttpDelete("keys/{key}")]
    public async Task<IActionResult> RemoveKey(string key)
    {
        await _cacheManager.RemoveKeyAsync(key);
        return Ok(new { Message = $"Key '{key}' removed." });
    }

    [HttpDelete("groups/{pattern}")]
    public async Task<IActionResult> RemoveGroup(string pattern)
    {
        await _cacheManager.RemoveByPatternAsync(pattern);
        return Ok(new { Message = $"Keys matching '{pattern}' removed." });
    }

    [HttpDelete("flush")]
    public async Task<IActionResult> Flush()
    {
        await _cacheManager.FlushDatabaseAsync();
        return Ok(new { Message = "Cache flushed." });
    }
}
