namespace InfoSystem.Core.ElasticSearch.Tests.Fixtures;

/// <summary>
/// xUnit collection definition.
/// Aynı collection'daki testler aynı fixture'ı paylaşır.
/// </summary>
[CollectionDefinition("ElasticSearch")]
public class ElasticSearchTestCollection : ICollectionFixture<ElasticSearchTestFixture>
{
    // Bu sınıf boş - sadece collection marker
}
