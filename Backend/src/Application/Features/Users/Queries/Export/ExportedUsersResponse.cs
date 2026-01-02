namespace Application.Features.Users.Queries.Export;

public class ExportedUsersResponse
{
    public byte[] FileContent { get; set; }
    public string FileName { get; set; }
    public string ContentType { get; set; }
}
