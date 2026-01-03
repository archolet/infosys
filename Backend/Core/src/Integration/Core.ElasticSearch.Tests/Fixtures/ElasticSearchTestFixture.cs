using DotNet.Testcontainers.Builders;
using Elastic.Clients.Elasticsearch;
using Elastic.Transport;
using InfoSystem.Core.ElasticSearch.Models;
using Testcontainers.Elasticsearch;

namespace InfoSystem.Core.ElasticSearch.Tests.Fixtures;

/// <summary>
/// Testcontainers ile Elasticsearch container yönetimi.
/// Tüm integration testleri bu fixture'ı paylaşır.
/// </summary>
public class ElasticSearchTestFixture : IAsyncLifetime
{
    private ElasticsearchContainer? _container;
    private ElasticsearchClient? _rawClient;

    public ElasticSearchManager ElasticSearchManager { get; private set; } = null!;
    public ElasticSearchConfig Config { get; private set; } = null!;

    /// <summary>
    /// Her test için unique index adı üretir.
    /// Bu method her çağrıldığında YENİ bir isim döner.
    /// </summary>
    public string TestIndexName => $"test-index-{Guid.NewGuid():N}";

    public async Task InitializeAsync()
    {
        // Elasticsearch 9.x container başlat (client 9.2.2 ile uyumlu)
        _container = new ElasticsearchBuilder()
            .WithImage("docker.elastic.co/elasticsearch/elasticsearch:9.0.1")
            .WithEnvironment("discovery.type", "single-node")
            .WithEnvironment("xpack.security.enabled", "false") // Test için security kapalı
            .WithEnvironment("ES_JAVA_OPTS", "-Xms512m -Xmx512m")
            .WithWaitStrategy(Wait.ForUnixContainer()
                .UntilHttpRequestIsSucceeded(r => r
                    .ForPath("/_cluster/health")
                    .ForPort(9200)
                    .ForStatusCode(System.Net.HttpStatusCode.OK)))
            .Build();

        await _container.StartAsync();

        // Config oluştur - HTTPS yerine HTTP kullan (xpack.security.enabled=false için)
        var httpsConnectionString = _container.GetConnectionString();
        var httpConnectionString = httpsConnectionString.Replace("https://", "http://");

        Config = new ElasticSearchConfig
        {
            ConnectionString = httpConnectionString,
            UserName = "elastic",
            Password = ""
        };

        // Manager instance'ı oluştur
        ElasticSearchManager = new ElasticSearchManager(Config);

        // Raw client for test utilities (refresh, etc.)
        var settings = new ElasticsearchClientSettings(new Uri(httpConnectionString))
            .Authentication(new BasicAuthentication(Config.UserName, Config.Password));
        _rawClient = new ElasticsearchClient(settings);
    }

    /// <summary>
    /// Index'i explicit olarak refresh eder.
    /// InsertManyAsync sonrasında arama yapılabilmesi için gerekli.
    /// </summary>
    public async Task RefreshIndexAsync(string indexName)
    {
        if (_rawClient == null)
            throw new InvalidOperationException("Client not initialized");

        await _rawClient.Indices.RefreshAsync(indexName);
    }

    public async Task DisposeAsync()
    {
        if (_container != null)
        {
            await _container.StopAsync();
            await _container.DisposeAsync();
        }
    }
}
