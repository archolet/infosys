using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Core.CrossCuttingConcerns.FileTransfer.Abstraction;
using InfoSystem.Core.Security.Constants;

namespace WebAPI.Controllers;

/// <summary>
/// FileTransfer test endpoint'leri - Swagger uzerinden manuel test icin
/// </summary>
[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = GeneralOperationClaims.Admin)]
public class FileTransferTestController : ControllerBase
{
    private readonly IFileTransferService _fileTransferService;

    public FileTransferTestController(IFileTransferService fileTransferService)
    {
        _fileTransferService = fileTransferService;
    }

    #region Export Operations

    /// <summary>
    /// Test verileri ile Excel export
    /// </summary>
    [HttpGet("export/excel")]
    [Produces("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")]
    public IActionResult ExportExcel([FromQuery] int recordCount = 10)
    {
        var data = GenerateTestData(recordCount);
        var bytes = _fileTransferService.Export(data, FileTransferType.Excel);
        var contentType = _fileTransferService.GetContentType(FileTransferType.Excel);
        var extension = _fileTransferService.GetFileExtension(FileTransferType.Excel);

        return File(bytes, contentType, $"test-export{extension}");
    }

    /// <summary>
    /// Test verileri ile CSV export
    /// </summary>
    [HttpGet("export/csv")]
    [Produces("text/csv")]
    public IActionResult ExportCsv([FromQuery] int recordCount = 10)
    {
        var data = GenerateTestData(recordCount);
        var bytes = _fileTransferService.Export(data, FileTransferType.Csv);
        var contentType = _fileTransferService.GetContentType(FileTransferType.Csv);
        var extension = _fileTransferService.GetFileExtension(FileTransferType.Csv);

        return File(bytes, contentType, $"test-export{extension}");
    }

    /// <summary>
    /// Test verileri ile PDF export
    /// </summary>
    [HttpGet("export/pdf")]
    [Produces("application/pdf")]
    public IActionResult ExportPdf([FromQuery] int recordCount = 10)
    {
        var data = GenerateTestData(recordCount);
        var bytes = _fileTransferService.Export(data, FileTransferType.Pdf);
        var contentType = _fileTransferService.GetContentType(FileTransferType.Pdf);
        var extension = _fileTransferService.GetFileExtension(FileTransferType.Pdf);

        return File(bytes, contentType, $"test-export{extension}");
    }

    /// <summary>
    /// Test verileri ile Word export
    /// </summary>
    [HttpGet("export/word")]
    [Produces("application/vnd.openxmlformats-officedocument.wordprocessingml.document")]
    public IActionResult ExportWord([FromQuery] int recordCount = 10)
    {
        var data = GenerateTestData(recordCount);
        var bytes = _fileTransferService.Export(data, FileTransferType.Word);
        var contentType = _fileTransferService.GetContentType(FileTransferType.Word);
        var extension = _fileTransferService.GetFileExtension(FileTransferType.Word);

        return File(bytes, contentType, $"test-export{extension}");
    }

    /// <summary>
    /// Test verileri ile Markdown export
    /// </summary>
    [HttpGet("export/markdown")]
    [Produces("text/markdown")]
    public IActionResult ExportMarkdown([FromQuery] int recordCount = 10)
    {
        var data = GenerateTestData(recordCount);
        var bytes = _fileTransferService.Export(data, FileTransferType.Markdown);
        var contentType = _fileTransferService.GetContentType(FileTransferType.Markdown);
        var extension = _fileTransferService.GetFileExtension(FileTransferType.Markdown);

        return File(bytes, contentType, $"test-export{extension}");
    }

    #endregion

    #region Custom Data Export

    /// <summary>
    /// Kullanici tanimli verilerle export
    /// </summary>
    [HttpPost("export/{format}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public IActionResult ExportCustomData(
        [FromRoute] string format,
        [FromBody] List<ExportDataRequest> data)
    {
        if (!Enum.TryParse<FileTransferType>(format, true, out var fileType))
        {
            return BadRequest(new { error = $"Invalid format: {format}. Valid formats: Excel, Csv, Pdf, Word, Markdown" });
        }

        var bytes = _fileTransferService.Export(data, fileType);
        var contentType = _fileTransferService.GetContentType(fileType);
        var extension = _fileTransferService.GetFileExtension(fileType);

        return File(bytes, contentType, $"custom-export{extension}");
    }

    #endregion

    #region Info Endpoints

    /// <summary>
    /// Desteklenen export formatlarini listeler
    /// </summary>
    [HttpGet("formats")]
    [ProducesResponseType(typeof(List<FormatInfoResponse>), StatusCodes.Status200OK)]
    public IActionResult GetSupportedFormats()
    {
        var formats = Enum.GetValues<FileTransferType>()
            .Select(type => new FormatInfoResponse
            {
                Format = type.ToString(),
                ContentType = _fileTransferService.GetContentType(type),
                Extension = _fileTransferService.GetFileExtension(type)
            })
            .ToList();

        return Ok(formats);
    }

    /// <summary>
    /// Test verisi preview (export oncesi)
    /// </summary>
    [HttpGet("preview")]
    [ProducesResponseType(typeof(List<FileTransferTestProduct>), StatusCodes.Status200OK)]
    public IActionResult PreviewTestData([FromQuery] int recordCount = 10)
    {
        var data = GenerateTestData(recordCount);
        return Ok(data);
    }

    #endregion

    #region Private Methods

    private static List<FileTransferTestProduct> GenerateTestData(int count)
    {
        var categories = new[] { "Electronics", "Clothing", "Books", "Home", "Sports" };
        var random = new Random();

        return Enumerable.Range(1, count)
            .Select(i => new FileTransferTestProduct
            {
                Id = Guid.NewGuid(),
                Name = $"Product {i}",
                Description = $"Description for product {i}",
                Price = Math.Round((decimal)(random.NextDouble() * 1000), 2),
                Category = categories[random.Next(categories.Length)],
                CreatedDate = DateTime.UtcNow.AddDays(-random.Next(365)),
                IsActive = random.Next(2) == 1
            })
            .ToList();
    }

    #endregion
}

#region Request/Response Models

public class ExportDataRequest
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Category { get; set; } = string.Empty;
}

public class FormatInfoResponse
{
    public string Format { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public string Extension { get; set; } = string.Empty;
}

public class FileTransferTestProduct
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
