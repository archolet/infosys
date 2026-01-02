using Core.CrossCuttingConcerns.FileTransfer.Abstraction;
using MediatR;

namespace Application.Features.Users.Queries.Export;

public class ExportUsersQuery : IRequest<ExportedUsersResponse>
{
    public FileTransferType ExportType { get; set; }
}
