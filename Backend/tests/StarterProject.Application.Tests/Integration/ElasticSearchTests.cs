using InfoSystem.Core.ElasticSearch;
using InfoSystem.Core.ElasticSearch.Models;
using Xunit;

namespace StarterProject.Application.Tests.Integration;

public class ElasticSearchTests
{
    [Fact]
    public async Task InsertManyAsync_ShouldAttemptConnection_AndThrowOrReturnFalse_WhenNoServer()
    {
        // Arrange
        var config = new ElasticSearchConfig
        {
            ConnectionString = "http://localhost:9200",
            UserName = "elastic",
            Password = "password"
        };
        var manager = new ElasticSearchManager(config);
        var items = Enumerable.Range(0, 5000).Select(i => new { Id = i, Name = $"Item {i}" }).ToList();

        // Act & Assert
        // Since there is no ES server, we expect either an exception (handled in manager) returning success:false
        // or a timeout. The Manager catches exceptions in the loop and adds them to a bag.
        // It returns success:false if exceptions occurred.

        var result = await manager.InsertManyAsync("test-index", items);

        Assert.False(result.Success);
        Assert.Contains("failed", result.Message);
        // Assert.Contains("Connection refused", result.Message); // Message content might vary based on OS/Network
    }
}
