using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using InfoSystem.Core.ElasticSearch;
using InfoSystem.Core.ElasticSearch.Models;
using InfoSystem.Core.Security.Constants;

namespace WebAPI.Controllers;

/// <summary>
/// ElasticSearch test endpoint'leri - Swagger uzerinden manuel test icin
/// </summary>
[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = GeneralOperationClaims.Admin)]
public class ElasticSearchTestController : ControllerBase
{
    private readonly IElasticSearch _elasticSearch;
    private const string DefaultTestIndex = "test-products";

    public ElasticSearchTestController(IElasticSearch elasticSearch)
    {
        _elasticSearch = elasticSearch;
    }

    #region Index Operations

    /// <summary>
    /// Yeni bir index olusturur
    /// </summary>
    [HttpPost("index")]
    [ProducesResponseType(typeof(IElasticSearchResult), StatusCodes.Status200OK)]
    public async Task<IActionResult> CreateIndex([FromBody] CreateIndexRequest request)
    {
        var model = new IndexModel
        {
            IndexName = request.IndexName ?? DefaultTestIndex,
            AliasName = request.AliasName ?? $"{request.IndexName ?? DefaultTestIndex}-alias",
            NumberOfReplicas = request.NumberOfReplicas,
            NumberOfShards = request.NumberOfShards
        };

        var result = await _elasticSearch.CreateNewIndexAsync(model);
        return Ok(result);
    }

    /// <summary>
    /// Tum index'leri listeler
    /// </summary>
    [HttpGet("index")]
    [ProducesResponseType(typeof(IReadOnlyDictionary<string, object>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllIndices()
    {
        var indices = await _elasticSearch.GetIndexListAsync();
        return Ok(indices.Keys.Select(k => k.ToString()));
    }

    #endregion

    #region Document Operations

    /// <summary>
    /// Tek bir document ekler
    /// </summary>
    [HttpPost("document")]
    [ProducesResponseType(typeof(IElasticSearchResult), StatusCodes.Status200OK)]
    public async Task<IActionResult> InsertDocument([FromBody] InsertDocumentRequest request)
    {
        var elasticId = request.ElasticId ?? Guid.NewGuid().ToString();
        var indexName = request.IndexName ?? DefaultTestIndex;
        var product = new TestProduct
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Description = request.Description,
            Price = request.Price,
            Category = request.Category,
            CreatedDate = DateTime.UtcNow,
            IsActive = true
        };

        var model = new ElasticSearchInsertUpdateModel(elasticId, indexName, product);

        var result = await _elasticSearch.InsertAsync(model);
        return Ok(new { result, elasticId = model.ElasticId });
    }

    /// <summary>
    /// Birden fazla document ekler (bulk insert)
    /// </summary>
    [HttpPost("documents/bulk")]
    [ProducesResponseType(typeof(IElasticSearchResult), StatusCodes.Status200OK)]
    public async Task<IActionResult> InsertManyDocuments([FromBody] InsertManyDocumentsRequest request)
    {
        var products = Enumerable.Range(1, request.Count).Select(i => new TestProduct
        {
            Id = Guid.NewGuid(),
            Name = $"{request.NamePrefix ?? "Product"} {i}",
            Description = $"Description for product {i}",
            Price = 10.00m * i,
            Category = request.Category ?? "Test",
            CreatedDate = DateTime.UtcNow,
            IsActive = true
        }).Cast<object>().ToList();

        var result = await _elasticSearch.InsertManyAsync(request.IndexName ?? DefaultTestIndex, products);
        return Ok(new { result, insertedCount = products.Count });
    }

    /// <summary>
    /// Document gunceller
    /// </summary>
    [HttpPut("document")]
    [ProducesResponseType(typeof(IElasticSearchResult), StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateDocument([FromBody] UpdateDocumentRequest request)
    {
        var indexName = request.IndexName ?? DefaultTestIndex;
        var product = new TestProduct
        {
            Id = Guid.Parse(request.ElasticId),
            Name = request.Name,
            Description = request.Description,
            Price = request.Price,
            Category = request.Category,
            CreatedDate = DateTime.UtcNow,
            IsActive = request.IsActive
        };
        var model = new ElasticSearchInsertUpdateModel(request.ElasticId, indexName, product);

        var result = await _elasticSearch.UpdateByElasticIdAsync(model);
        return Ok(result);
    }

    /// <summary>
    /// Document siler
    /// </summary>
    [HttpDelete("document/{indexName}/{elasticId}")]
    [ProducesResponseType(typeof(IElasticSearchResult), StatusCodes.Status200OK)]
    public async Task<IActionResult> DeleteDocument(string indexName, string elasticId)
    {
        var model = new ElasticSearchModel
        {
            IndexName = indexName,
            ElasticId = elasticId
        };

        var result = await _elasticSearch.DeleteByElasticIdAsync(model);
        return Ok(result);
    }

    #endregion

    #region Search Operations

    /// <summary>
    /// Tum document'lari getirir
    /// </summary>
    [HttpGet("search/{indexName}")]
    [ProducesResponseType(typeof(List<ElasticSearchGetModel<TestProduct>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllDocuments(string indexName, [FromQuery] int from = 0, [FromQuery] int size = 10)
    {
        var parameters = new SearchParameters
        {
            IndexName = indexName,
            From = from,
            Size = size
        };

        var results = await _elasticSearch.GetAllSearch<TestProduct>(parameters);
        return Ok(new { count = results.Count, results });
    }

    /// <summary>
    /// Query string ile arama yapar
    /// </summary>
    [HttpGet("search/{indexName}/query")]
    [ProducesResponseType(typeof(List<ElasticSearchGetModel<TestProduct>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> SearchByQuery(
        string indexName,
        [FromQuery] string query,
        [FromQuery] string fields = "name,description",
        [FromQuery] int from = 0,
        [FromQuery] int size = 10)
    {
        var parameters = new SearchByQueryParameters
        {
            IndexName = indexName,
            Query = query,
            QueryName = "test-query",
            Fields = fields.Split(',').Select(f => f.Trim()).ToArray(),
            From = from,
            Size = size
        };

        var results = await _elasticSearch.GetSearchBySimpleQueryString<TestProduct>(parameters);
        return Ok(new { count = results.Count, results });
    }

    #endregion

    #region Health Check

    /// <summary>
    /// ElasticSearch baglanti durumunu kontrol eder
    /// </summary>
    [HttpGet("health")]
    [ProducesResponseType(typeof(HealthCheckResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> HealthCheck()
    {
        try
        {
            var indices = await _elasticSearch.GetIndexListAsync();
            return Ok(new HealthCheckResponse
            {
                Status = "Healthy",
                IndexCount = indices.Count,
                Message = "ElasticSearch connection successful"
            });
        }
        catch (Exception ex)
        {
            return Ok(new HealthCheckResponse
            {
                Status = "Unhealthy",
                IndexCount = 0,
                Message = ex.Message
            });
        }
    }

    #endregion
}

#region Request/Response Models

public class CreateIndexRequest
{
    public string? IndexName { get; set; }
    public string? AliasName { get; set; }
    public int NumberOfReplicas { get; set; } = 1;
    public int NumberOfShards { get; set; } = 3;
}

public class InsertDocumentRequest
{
    public string? IndexName { get; set; }
    public string? ElasticId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Category { get; set; } = string.Empty;
}

public class InsertManyDocumentsRequest
{
    public string? IndexName { get; set; }
    public int Count { get; set; } = 10;
    public string? NamePrefix { get; set; }
    public string? Category { get; set; }
}

public class UpdateDocumentRequest
{
    public string? IndexName { get; set; }
    public string ElasticId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Category { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
}

public class HealthCheckResponse
{
    public string Status { get; set; } = string.Empty;
    public int IndexCount { get; set; }
    public string Message { get; set; } = string.Empty;
}

public class TestProduct
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Category { get; set; } = string.Empty;
    public DateTime CreatedDate { get; set; }
    public bool IsActive { get; set; }
}

#endregion
