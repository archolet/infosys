using System.Collections.Concurrent;
using Elastic.Clients.Elasticsearch;
using Elastic.Clients.Elasticsearch.Core.Bulk;
using Elastic.Clients.Elasticsearch.IndexManagement;
using Elastic.Clients.Elasticsearch.QueryDsl;
using Elastic.Transport;
using InfoSystem.Core.ElasticSearch.Constants;
using InfoSystem.Core.ElasticSearch.Models;

namespace InfoSystem.Core.ElasticSearch;

public class ElasticSearchManager : IElasticSearch
{
    private readonly ElasticsearchClient _client;

    public ElasticSearchManager(ElasticSearchConfig configuration)
    {
        var settings = new ElasticsearchClientSettings(new Uri(configuration.ConnectionString))
            .Authentication(new BasicAuthentication(configuration.UserName, configuration.Password));

        _client = new ElasticsearchClient(settings);
    }

    public async Task<IReadOnlyDictionary<IndexName, IndexState>> GetIndexListAsync()
    {
        var response = await _client.Indices.GetAsync(new GetIndexRequest(Indices.All));
        return response.Indices.ToDictionary(k => (IndexName)k.Key, v => v.Value);
    }

    public async Task<IElasticSearchResult> InsertManyAsync(string indexName, IEnumerable<object> items)
    {
        const int batchSize = 1000;
        var parallelOptions = new ParallelOptions { MaxDegreeOfParallelism = Environment.ProcessorCount };
        var batches = items.Chunk(batchSize);

        var exceptions = new ConcurrentBag<Exception>();

        await Parallel.ForEachAsync(batches, parallelOptions, async (batch, cancellationToken) =>
        {
            try
            {
                var bulkResponse = await _client.BulkAsync(b => b
                    .Index(indexName)
                    .IndexMany(batch)
                , cancellationToken);

                if (!bulkResponse.IsValidResponse)
                {
                     exceptions.Add(new Exception(bulkResponse.DebugInformation));
                }
                else if (bulkResponse.Errors)
                {
                    foreach (var itemWithError in bulkResponse.ItemsWithErrors)
                    {
                        exceptions.Add(new Exception($"Item error: {itemWithError.Error?.Reason}"));
                    }
                }
            }
            catch (Exception ex)
            {
                exceptions.Add(ex);
            }
        });

        if (!exceptions.IsEmpty)
        {
            return new ElasticSearchResult(
                success: false,
                message: $"Bulk insert failed with {exceptions.Count} errors. First: {exceptions.First().Message}"
            );
        }

        return new ElasticSearchResult(true, ElasticSearchMessages.Success);
    }

    public async Task<IElasticSearchResult> CreateNewIndexAsync(IndexModel indexModel)
    {
        var existsResponse = await _client.Indices.ExistsAsync(indexModel.IndexName);
        if (existsResponse.Exists)
            return new ElasticSearchResult(success: false, message: ElasticSearchMessages.IndexAlreadyExists);

        var response = await _client.Indices.CreateAsync(indexModel.IndexName, c => c
            .Settings(s => s
                .NumberOfReplicas(indexModel.NumberOfReplicas)
                .NumberOfShards(indexModel.NumberOfShards)
            )
            .Aliases(a => a.Add(indexModel.AliasName, new Alias()))
        );

        return new ElasticSearchResult(
            response.IsValidResponse,
            message: response.IsValidResponse ? ElasticSearchMessages.Success : response.DebugInformation
        );
    }

    public async Task<IElasticSearchResult> DeleteByElasticIdAsync(ElasticSearchModel model)
    {
        var response = await _client.DeleteAsync(model.IndexName, model.ElasticId);
        return new ElasticSearchResult(
            response.IsValidResponse,
            message: response.IsValidResponse ? ElasticSearchMessages.Success : response.DebugInformation
        );
    }

    public async Task<List<ElasticSearchGetModel<T>>> GetAllSearch<T>(SearchParameters parameters)
        where T : class
    {
        var searchResponse = await _client.SearchAsync<T>(s => s
            .Indices(parameters.IndexName)
            .From(parameters.From)
            .Size(parameters.Size)
            .Query(q => q.MatchAll(m => {}))
        );

        var list = searchResponse.Hits
            .Select(x => new ElasticSearchGetModel<T> { ElasticId = x.Id, Item = x.Source! })
            .ToList();

        return list;
    }

    public async Task<List<ElasticSearchGetModel<T>>> GetSearchByField<T>(SearchByFieldParameters fieldParameters)
        where T : class
    {
        var searchResponse = await _client.SearchAsync<T>(s => s
            .Indices(fieldParameters.IndexName)
            .From(fieldParameters.From)
            .Size(fieldParameters.Size)
        );

        var list = searchResponse.Hits
            .Select(x => new ElasticSearchGetModel<T> { ElasticId = x.Id, Item = x.Source! })
            .ToList();

        return list;
    }

    public async Task<List<ElasticSearchGetModel<T>>> GetSearchBySimpleQueryString<T>(SearchByQueryParameters queryParameters)
        where T : class
    {
        var searchResponse = await _client.SearchAsync<T>(s => s
            .Indices(queryParameters.IndexName)
            .From(queryParameters.From)
            .Size(queryParameters.Size)
            .Query(q => q
                .SimpleQueryString(sq => sq
                    .QueryName(queryParameters.QueryName)
                    .Boost(1.1f)
                    .Fields(queryParameters.Fields)
                    .Query(queryParameters.Query)
                    .Analyzer("standard")
                    .DefaultOperator(Operator.Or)
                    .Flags(SimpleQueryStringFlags.And | SimpleQueryStringFlags.Near)
                    .Lenient(true)
                    .AnalyzeWildcard(false)
                    .MinimumShouldMatch("30%")
                    .FuzzyPrefixLength(0)
                    .FuzzyMaxExpansions(50)
                    .FuzzyTranspositions(true)
                    .AutoGenerateSynonymsPhraseQuery(false)
                )
            )
        );

        var list = searchResponse.Hits
            .Select(x => new ElasticSearchGetModel<T> { ElasticId = x.Id, Item = x.Source! })
            .ToList();

        return list;
    }

    public async Task<IElasticSearchResult> InsertAsync(ElasticSearchInsertUpdateModel model)
    {
        var response = await _client.IndexAsync(model.Item, i => i
            .Index(model.IndexName)
            .Id(model.ElasticId)
            .Refresh(Refresh.True)
        );

        return new ElasticSearchResult(
            response.IsValidResponse,
            message: response.IsValidResponse ? ElasticSearchMessages.Success : response.DebugInformation
        );
    }

    public async Task<IElasticSearchResult> UpdateByElasticIdAsync(ElasticSearchInsertUpdateModel model)
    {
        var response = await _client.UpdateAsync<object, object>(
            model.IndexName,
            model.ElasticId,
            u => u.Doc(model.Item)
        );

        return new ElasticSearchResult(
            response.IsValidResponse,
            message: response.IsValidResponse ? ElasticSearchMessages.Success : response.DebugInformation
        );
    }
}
