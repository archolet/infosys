using FluentAssertions;
using InfoSystem.Core.ElasticSearch.Models;
using Moq;

namespace InfoSystem.Core.ElasticSearch.Tests.Unit;

/// <summary>
/// Mock-based Unit Tests.
/// Docker olmadan çalışır - sadece interface sözleşmesini test eder.
/// </summary>
public class ElasticSearchMockTests
{
    private readonly Mock<IElasticSearch> _mockElasticSearch;

    public ElasticSearchMockTests()
    {
        _mockElasticSearch = new Mock<IElasticSearch>();
    }

    #region Interface Contract Tests

    [Fact]
    public async Task CreateNewIndexAsync_ShouldReturnSuccess_WhenCalled()
    {
        // Arrange
        var indexModel = new IndexModel
        {
            IndexName = "test-index",
            AliasName = "test-alias",
            NumberOfReplicas = 1,
            NumberOfShards = 3
        };

        _mockElasticSearch
            .Setup(x => x.CreateNewIndexAsync(It.IsAny<IndexModel>()))
            .ReturnsAsync(new ElasticSearchResult(true, "Success"));

        // Act
        var result = await _mockElasticSearch.Object.CreateNewIndexAsync(indexModel);

        // Assert
        result.Success.Should().BeTrue();
        _mockElasticSearch.Verify(x => x.CreateNewIndexAsync(indexModel), Times.Once);
    }

    [Fact]
    public async Task InsertAsync_ShouldCallWithCorrectParameters()
    {
        // Arrange
        var model = new ElasticSearchInsertUpdateModel(
            elasticId: "123",
            indexName: "products",
            item: new { Name = "Test Product" }
        );

        _mockElasticSearch
            .Setup(x => x.InsertAsync(It.IsAny<ElasticSearchInsertUpdateModel>()))
            .ReturnsAsync(new ElasticSearchResult(true, "Inserted"));

        // Act
        var result = await _mockElasticSearch.Object.InsertAsync(model);

        // Assert
        result.Success.Should().BeTrue();
        _mockElasticSearch.Verify(x => x.InsertAsync(It.Is<ElasticSearchInsertUpdateModel>(
            m => m.IndexName == "products" && m.ElasticId == "123")), Times.Once);
    }

    [Fact]
    public async Task InsertManyAsync_ShouldAcceptEnumerable()
    {
        // Arrange
        var items = new List<object>
        {
            new { Id = 1, Name = "Product 1" },
            new { Id = 2, Name = "Product 2" },
            new { Id = 3, Name = "Product 3" }
        };

        _mockElasticSearch
            .Setup(x => x.InsertManyAsync(It.IsAny<string>(), It.IsAny<IEnumerable<object>>()))
            .ReturnsAsync(new ElasticSearchResult(true, "Bulk insert success"));

        // Act
        var result = await _mockElasticSearch.Object.InsertManyAsync("products", items);

        // Assert
        result.Success.Should().BeTrue();
        _mockElasticSearch.Verify(x => x.InsertManyAsync("products", It.Is<IEnumerable<object>>(
            e => e.Count() == 3)), Times.Once);
    }

    [Fact]
    public async Task GetAllSearch_ShouldReturnTypedResults()
    {
        // Arrange
        var expectedResults = new List<ElasticSearchGetModel<TestProduct>>
        {
            new() { ElasticId = "1", Item = new TestProduct { Name = "Product 1" } },
            new() { ElasticId = "2", Item = new TestProduct { Name = "Product 2" } }
        };

        _mockElasticSearch
            .Setup(x => x.GetAllSearch<TestProduct>(It.IsAny<SearchParameters>()))
            .ReturnsAsync(expectedResults);

        var parameters = new SearchParameters
        {
            IndexName = "products",
            From = 0,
            Size = 10
        };

        // Act
        var result = await _mockElasticSearch.Object.GetAllSearch<TestProduct>(parameters);

        // Assert
        result.Should().HaveCount(2);
        result.First().Item.Name.Should().Be("Product 1");
    }

    [Fact]
    public async Task DeleteByElasticIdAsync_ShouldReturnFailure_WhenNotFound()
    {
        // Arrange
        var model = new ElasticSearchModel
        {
            IndexName = "products",
            ElasticId = "non-existent"
        };

        _mockElasticSearch
            .Setup(x => x.DeleteByElasticIdAsync(It.IsAny<ElasticSearchModel>()))
            .ReturnsAsync(new ElasticSearchResult(false, "Document not found"));

        // Act
        var result = await _mockElasticSearch.Object.DeleteByElasticIdAsync(model);

        // Assert
        result.Success.Should().BeFalse();
        result.Message.Should().Contain("not found");
    }

    #endregion

    #region ElasticSearchResult Tests

    [Fact]
    public void ElasticSearchResult_ShouldHaveCorrectProperties()
    {
        // Arrange & Act
        var successResult = new ElasticSearchResult(true, "Operation successful");
        var failureResult = new ElasticSearchResult(false, "Operation failed");

        // Assert
        successResult.Success.Should().BeTrue();
        successResult.Message.Should().Be("Operation successful");

        failureResult.Success.Should().BeFalse();
        failureResult.Message.Should().Be("Operation failed");
    }

    [Fact]
    public void ElasticSearchResult_DefaultConstructor_ShouldHaveEmptyMessage()
    {
        // Act
        var result = new ElasticSearchResult();

        // Assert
        result.Message.Should().BeEmpty();
    }

    #endregion

    #region Model Validation Tests

    [Fact]
    public void IndexModel_ShouldHaveValidDefaults()
    {
        // Act
        var model = new IndexModel
        {
            IndexName = "test",
            AliasName = "test-alias"
        };

        // Assert
        model.IndexName.Should().NotBeNullOrEmpty();
        model.AliasName.Should().NotBeNullOrEmpty();
    }

    [Fact]
    public void SearchParameters_ShouldAcceptPaginationValues()
    {
        // Act
        var parameters = new SearchParameters
        {
            IndexName = "products",
            From = 20,
            Size = 50
        };

        // Assert
        parameters.From.Should().Be(20);
        parameters.Size.Should().Be(50);
    }

    [Fact]
    public void ElasticSearchGetModel_ShouldContainIdAndItem()
    {
        // Act
        var model = new ElasticSearchGetModel<TestProduct>
        {
            ElasticId = "abc123",
            Item = new TestProduct { Name = "Test" }
        };

        // Assert
        model.ElasticId.Should().Be("abc123");
        model.Item.Should().NotBeNull();
        model.Item.Name.Should().Be("Test");
    }

    #endregion

    // Test helper class
    private class TestProduct
    {
        public string Name { get; set; } = string.Empty;
    }
}
