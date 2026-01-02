using Elastic.Clients.Elasticsearch;

namespace InfoSystem.Core.ElasticSearch.Models;

public class ElasticSearchInsertManyModel
{
    public string IndexName { get; set; }
    public object[] Items { get; set; }

    public ElasticSearchInsertManyModel()
    {
        IndexName = string.Empty;
        Items = Array.Empty<object>();
    }

    public ElasticSearchInsertManyModel(string indexName, object[] items)
    {
        IndexName = indexName;
        Items = items;
    }
}
