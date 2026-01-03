using FluentAssertions;
using InfoSystem.Core.ElasticSearch.Models;
using InfoSystem.Core.ElasticSearch.Tests.Fixtures;
using InfoSystem.Core.ElasticSearch.Tests.TestData;

namespace InfoSystem.Core.ElasticSearch.Tests.Integration;

/// <summary>
/// ElasticSearchManager Integration Tests.
/// Gerçek Elasticsearch container ile test eder.
/// </summary>
[Collection("ElasticSearch")]
public class ElasticSearchManagerIntegrationTests : IClassFixture<ElasticSearchTestFixture>
{
    private readonly ElasticSearchTestFixture _fixture;
    private readonly ElasticSearchManager _manager;

    public ElasticSearchManagerIntegrationTests(ElasticSearchTestFixture fixture)
    {
        _fixture = fixture;
        _manager = fixture.ElasticSearchManager;
    }

    #region Index Operations

    [Fact]
    public async Task CreateNewIndexAsync_ShouldCreateIndex_WhenIndexDoesNotExist()
    {
        // Arrange
        var indexName = _fixture.TestIndexName;
        var indexModel = new IndexModel
        {
            IndexName = indexName,
            AliasName = $"alias-{Guid.NewGuid():N}",
            NumberOfReplicas = 0,
            NumberOfShards = 1
        };

        // Act
        var result = await _manager.CreateNewIndexAsync(indexModel);

        // Assert
        result.Success.Should().BeTrue();
        result.Message.Should().Contain("Success");
    }

    [Fact]
    public async Task CreateNewIndexAsync_ShouldFail_WhenIndexAlreadyExists()
    {
        // Arrange
        var indexName = _fixture.TestIndexName;
        var indexModel = new IndexModel
        {
            IndexName = indexName,
            AliasName = $"alias-{Guid.NewGuid():N}",
            NumberOfReplicas = 0,
            NumberOfShards = 1
        };

        // İlk index'i oluştur
        await _manager.CreateNewIndexAsync(indexModel);

        // Act - Aynı index'i tekrar oluşturmaya çalış
        var result = await _manager.CreateNewIndexAsync(indexModel);

        // Assert
        result.Success.Should().BeFalse();
        result.Message.Should().Contain("already exists");
    }

    [Fact]
    public async Task GetIndexListAsync_ShouldReturnIndices_WhenIndicesExist()
    {
        // Arrange
        var indexName = _fixture.TestIndexName;
        var indexModel = new IndexModel
        {
            IndexName = indexName,
            AliasName = $"alias-{Guid.NewGuid():N}",
            NumberOfReplicas = 0,
            NumberOfShards = 1
        };
        await _manager.CreateNewIndexAsync(indexModel);

        // Act
        var indices = await _manager.GetIndexListAsync();

        // Assert
        indices.Should().NotBeEmpty();
        indices.Keys.Select(k => k.ToString()).Should().Contain(indexModel.IndexName);
    }

    #endregion

    #region Insert Operations

    [Fact]
    public async Task InsertAsync_ShouldInsertDocument_WhenValidData()
    {
        // Arrange
        var indexName = _fixture.TestIndexName;
        await CreateTestIndex(indexName);

        var product = ProductTestData.Generate();
        var model = new ElasticSearchInsertUpdateModel(
            elasticId: product.Id.ToString(),
            indexName: indexName,
            item: product
        );

        // Act
        var result = await _manager.InsertAsync(model);

        // Assert
        result.Success.Should().BeTrue();
        result.Message.Should().Contain("Success");
    }

    [Fact]
    public async Task InsertManyAsync_ShouldInsertAllDocuments_WhenBatchIsSmall()
    {
        // Arrange
        var indexName = _fixture.TestIndexName;
        await CreateTestIndex(indexName);

        var products = ProductTestData.GenerateMany(100);

        // Act
        var result = await _manager.InsertManyAsync(indexName, products.Cast<object>());

        // Assert
        result.Success.Should().BeTrue($"InsertManyAsync failed: {result.Message}");
        result.Message.Should().Contain("Success");
    }

    [Fact]
    public async Task InsertManyAsync_ShouldHandleLargeBatch_WhenOverBatchSize()
    {
        // Arrange
        var indexName = _fixture.TestIndexName;
        await CreateTestIndex(indexName);

        // 2500 kayıt - batch size 1000'den büyük
        var products = ProductTestData.GenerateMany(2500);

        // Act
        var result = await _manager.InsertManyAsync(indexName, products.Cast<object>());

        // Assert
        result.Success.Should().BeTrue();
        result.Message.Should().Contain("Success");
    }

    #endregion

    #region Search Operations

    [Fact]
    public async Task GetAllSearch_ShouldReturnDocuments_WhenDocumentsExist()
    {
        // Arrange
        var indexName = _fixture.TestIndexName;
        await CreateTestIndex(indexName);

        var products = ProductTestData.GenerateMany(10);
        await _manager.InsertManyAsync(indexName, products.Cast<object>());

        // Explicit refresh - InsertManyAsync sonrası gerekli!
        await _fixture.RefreshIndexAsync(indexName);

        var parameters = new SearchParameters
        {
            IndexName = indexName,
            From = 0,
            Size = 20
        };

        // Act
        var results = await _manager.GetAllSearch<Product>(parameters);

        // Assert
        results.Should().NotBeEmpty();
        results.Count.Should().BeGreaterThanOrEqualTo(10);
        results.All(r => r.Item != null).Should().BeTrue();
        results.All(r => !string.IsNullOrEmpty(r.ElasticId)).Should().BeTrue();
    }

    [Fact]
    public async Task GetSearchBySimpleQueryString_ShouldFindMatchingDocuments()
    {
        // Arrange
        var indexName = _fixture.TestIndexName;
        await CreateTestIndex(indexName);

        var products = ProductTestData.GenerateMany(20);
        // Spesifik bir ürün ekle
        var targetProduct = new Product
        {
            Id = Guid.NewGuid(),
            Name = "UniqueTestProduct12345",
            Description = "Special test description",
            Price = 99.99m,
            Category = "TestCategory",
            CreatedDate = DateTime.UtcNow,
            IsActive = true
        };
        products.Add(targetProduct);

        await _manager.InsertManyAsync(indexName, products.Cast<object>());

        // Explicit refresh - InsertManyAsync sonrası gerekli!
        await _fixture.RefreshIndexAsync(indexName);

        var queryParams = new SearchByQueryParameters
        {
            IndexName = indexName,
            QueryName = "name_search",
            Query = "UniqueTestProduct12345",
            Fields = new[] { "name" },
            From = 0,
            Size = 10
        };

        // Act
        var results = await _manager.GetSearchBySimpleQueryString<Product>(queryParams);

        // Assert
        results.Should().NotBeEmpty();
        results.Should().Contain(r => r.Item.Name == "UniqueTestProduct12345");
    }

    #endregion

    #region Update Operations

    [Fact]
    public async Task UpdateByElasticIdAsync_ShouldUpdateDocument_WhenDocumentExists()
    {
        // Arrange
        var indexName = _fixture.TestIndexName;
        await CreateTestIndex(indexName);

        var product = ProductTestData.Generate();
        var elasticId = product.Id.ToString();

        var insertModel = new ElasticSearchInsertUpdateModel(
            elasticId: elasticId,
            indexName: indexName,
            item: product
        );
        await _manager.InsertAsync(insertModel);

        // Ürünü güncelle
        product.Name = "Updated Product Name";
        product.Price = 999.99m;

        var updateModel = new ElasticSearchInsertUpdateModel(
            elasticId: elasticId,
            indexName: indexName,
            item: product
        );

        // Act
        var result = await _manager.UpdateByElasticIdAsync(updateModel);

        // Assert
        result.Success.Should().BeTrue();
    }

    #endregion

    #region Delete Operations

    [Fact]
    public async Task DeleteByElasticIdAsync_ShouldDeleteDocument_WhenDocumentExists()
    {
        // Arrange
        var indexName = _fixture.TestIndexName;
        await CreateTestIndex(indexName);

        var product = ProductTestData.Generate();
        var elasticId = product.Id.ToString();

        var insertModel = new ElasticSearchInsertUpdateModel(
            elasticId: elasticId,
            indexName: indexName,
            item: product
        );
        await _manager.InsertAsync(insertModel);

        var deleteModel = new ElasticSearchModel
        {
            IndexName = indexName,
            ElasticId = elasticId
        };

        // Act
        var result = await _manager.DeleteByElasticIdAsync(deleteModel);

        // Assert
        result.Success.Should().BeTrue();
    }

    [Fact]
    public async Task DeleteByElasticIdAsync_ShouldReturnNotFound_WhenDocumentDoesNotExist()
    {
        // Arrange
        var indexName = _fixture.TestIndexName;
        await CreateTestIndex(indexName);

        var deleteModel = new ElasticSearchModel
        {
            IndexName = indexName,
            ElasticId = "non-existent-id-12345"
        };

        // Act
        var result = await _manager.DeleteByElasticIdAsync(deleteModel);

        // Assert
        result.Success.Should().BeFalse();
    }

    #endregion

    #region Helpers

    private async Task CreateTestIndex(string indexName)
    {
        var indexModel = new IndexModel
        {
            IndexName = indexName,
            AliasName = $"alias-{Guid.NewGuid():N}",
            NumberOfReplicas = 0,
            NumberOfShards = 1
        };
        await _manager.CreateNewIndexAsync(indexModel);
    }

    #endregion
}
