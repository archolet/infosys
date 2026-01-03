using Application.Features.Users.Constants;
using Application.Features.Users.Queries.GetList;
using Application.Services.Repositories;
using AutoMapper;
using Core.CrossCuttingConcerns.FileTransfer.Abstraction;
using Domain.Entities;
using MediatR;
using InfoSystem.Core.Application.Pipelines.Authorization;

namespace Application.Features.Users.Queries.Export;

public class ExportUsersQuery : IRequest<ExportUsersResponse>, ISecuredRequest
{
    public FileTransferType ExportType { get; set; }

    public string[] Roles => [UsersOperationClaims.Admin, UsersOperationClaims.Export];

    public ExportUsersQuery()
    {
        ExportType = FileTransferType.Excel;
    }

    public ExportUsersQuery(FileTransferType exportType)
    {
        ExportType = exportType;
    }

    public class ExportUsersQueryHandler : IRequestHandler<ExportUsersQuery, ExportUsersResponse>
    {
        private readonly IUserRepository _userRepository;
        private readonly IFileTransferService _fileTransferService;
        private readonly IMapper _mapper;

        public ExportUsersQueryHandler(
            IUserRepository userRepository,
            IFileTransferService fileTransferService,
            IMapper mapper)
        {
            _userRepository = userRepository;
            _fileTransferService = fileTransferService;
            _mapper = mapper;
        }

        public async Task<ExportUsersResponse> Handle(
            ExportUsersQuery request,
            CancellationToken cancellationToken)
        {
            var usersPage = await _userRepository.GetListAsync(
                size: int.MaxValue,
                enableTracking: false,
                cancellationToken: cancellationToken
            );
            IList<User> users = usersPage.Items;

            IList<GetListUserListItemDto> userDtos = _mapper.Map<IList<GetListUserListItemDto>>(users);

            byte[] fileContent = _fileTransferService.Export(userDtos, request.ExportType);
            string contentType = _fileTransferService.GetContentType(request.ExportType);
            string extension = _fileTransferService.GetFileExtension(request.ExportType);
            string fileName = $"users-export-{DateTime.UtcNow:yyyyMMdd-HHmmss}{extension}";

            return new ExportUsersResponse(fileContent, contentType, fileName);
        }
    }
}
