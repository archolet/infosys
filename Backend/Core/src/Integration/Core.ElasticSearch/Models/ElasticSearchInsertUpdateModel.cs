using Elastic.Clients.Elasticsearch;

namespace InfoSystem.Core.ElasticSearch.Models;

public class ElasticSearchInsertUpdateModel
{
    public Id ElasticId { get; set; }
    public string IndexName { get; set; }
    public object Item { get; set; }

    public ElasticSearchInsertUpdateModel()
    {
        ElasticId = null!;
        IndexName = string.Empty;
        Item = null!;
    }

    public ElasticSearchInsertUpdateModel(Id elasticId, string indexName, object item)
    {
        ElasticId = elasticId;
        IndexName = indexName;
        Item = item;
    }
}
