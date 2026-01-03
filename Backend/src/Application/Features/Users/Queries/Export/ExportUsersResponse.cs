using InfoSystem.Core.Application.Dtos;

namespace Application.Features.Users.Queries.Export;

public class ExportUsersResponse : IDto
{
    public byte[] FileContent { get; set; }
    public string ContentType { get; set; }
    public string FileName { get; set; }

    public ExportUsersResponse()
    {
        FileContent = [];
        ContentType = string.Empty;
        FileName = string.Empty;
    }

    public ExportUsersResponse(byte[] fileContent, string contentType, string fileName)
    {
        FileContent = fileContent;
        ContentType = contentType;
        FileName = fileName;
    }
}
