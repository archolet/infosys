using Bogus;

namespace InfoSystem.Core.ElasticSearch.Tests.TestData;

/// <summary>
/// Test için kullanılacak örnek Product entity.
/// </summary>
public class Product
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Category { get; set; } = string.Empty;
    public DateTime CreatedDate { get; set; }
    public bool IsActive { get; set; }
}

/// <summary>
/// Bogus ile fake Product data üretici.
/// </summary>
public static class ProductTestData
{
    private static readonly Faker<Product> ProductFaker = new Faker<Product>("tr")
        .RuleFor(p => p.Id, f => Guid.NewGuid())
        .RuleFor(p => p.Name, f => f.Commerce.ProductName())
        .RuleFor(p => p.Description, f => f.Commerce.ProductDescription())
        .RuleFor(p => p.Price, f => f.Random.Decimal(10, 1000))
        .RuleFor(p => p.Category, f => f.Commerce.Categories(1).First())
        .RuleFor(p => p.CreatedDate, f => f.Date.Past(2))
        .RuleFor(p => p.IsActive, f => f.Random.Bool(0.9f));

    public static Product Generate() => ProductFaker.Generate();

    public static List<Product> GenerateMany(int count) => ProductFaker.Generate(count);
}
