using Application.Services.Repositories;
using AutoMapper;
using Core.CrossCuttingConcerns.FileTransfer.Abstraction;
using MediatR;
using Domain.Entities;
using Application.Features.Users.Queries.GetList;

namespace Application.Features.Users.Queries.Export;

public class ExportUsersQueryHandler : IRequestHandler<ExportUsersQuery, ExportedUsersResponse>
{
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;
    private readonly IFileTransferService _fileTransferService;

    public ExportUsersQueryHandler(
        IUserRepository userRepository,
        IMapper mapper,
        IFileTransferService fileTransferService)
    {
        _userRepository = userRepository;
        _mapper = mapper;
        _fileTransferService = fileTransferService;
    }

    public async Task<ExportedUsersResponse> Handle(ExportUsersQuery request, CancellationToken cancellationToken)
    {
        // Get all users
        var users = await _userRepository.GetListAsync(
            index: 0,
            size: int.MaxValue, // Export all
            cancellationToken: cancellationToken
        );

        // Map to simpler DTO for export (reuse GetListUserListItemDto or create new one)
        // Let's create a specific DTO or reuse existing.
        // For now, let's assume we want to export what we show in list.
        var userDtos = _mapper.Map<IList<GetListUserListItemDto>>(users.Items);

        byte[] fileContent = _fileTransferService.Export(userDtos, request.ExportType);
        string extension = _fileTransferService.GetFileExtension(request.ExportType);
        string contentType = _fileTransferService.GetContentType(request.ExportType);

        return new ExportedUsersResponse
        {
            FileContent = fileContent,
            FileName = $"Users_Export_{DateTime.Now:yyyyMMddHHmmss}{extension}",
            ContentType = contentType
        };
    }
}
