using System.Linq.Expressions;
using Application.Services.AuthService;
using Application.Services.Repositories;
using AutoMapper;
using Domain.Entities;
using Microsoft.EntityFrameworkCore.Query;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;
using InfoSystem.Core.Security.JWT;
using StarterProject.Application.Tests.Mocks.Configurations;

namespace StarterProject.Application.Tests.Features.Auth.Services;

public class AuthManagerRefreshTokenTests
{
    private readonly Mock<IRefreshTokenRepository> _refreshTokenRepositoryMock;
    private readonly List<RefreshToken> _refreshTokens;
    private readonly AuthManager _authManager;

    public AuthManagerRefreshTokenTests()
    {
        _refreshTokens = [];
        _refreshTokenRepositoryMock = new Mock<IRefreshTokenRepository>();

        _refreshTokenRepositoryMock
            .Setup(r =>
                r.GetAsync(
                    It.IsAny<Expression<Func<RefreshToken, bool>>>(),
                    null,
                    false,
                    true,
                    It.IsAny<CancellationToken>()
                )
            )
            .ReturnsAsync(
                (
                    Expression<Func<RefreshToken, bool>> predicate,
                    Func<IQueryable<RefreshToken>, IIncludableQueryable<RefreshToken, object>>? include,
                    bool withDeleted,
                    bool enableTracking,
                    CancellationToken cancellationToken
                ) => _refreshTokens.AsQueryable().FirstOrDefault(predicate.Compile())
            );

        _refreshTokenRepositoryMock
            .Setup(r => r.UpdateAsync(It.IsAny<RefreshToken>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((RefreshToken token, CancellationToken cancellationToken) => token);

        var userOperationClaimRepositoryMock = new Mock<IUserOperationClaimRepository>();
        var tokenHelperMock = new Mock<ITokenHelper<Guid, int, Guid>>();

        IMapper mapper = new Mapper(new MapperConfiguration(cfg => { }, NullLoggerFactory.Instance));

        _authManager = new AuthManager(
            userOperationClaimRepositoryMock.Object,
            _refreshTokenRepositoryMock.Object,
            tokenHelperMock.Object,
            MockConfiguration.GetConfigurationMock(),
            mapper
        );
    }

    [Fact]
    public async Task RevokeDescendantRefreshTokens_ShouldRevokeAllActiveDescendants()
    {
        RefreshToken ancestor =
            new()
            {
                Token = "ancestor-token",
                ReplacedByToken = "child-token-1",
                ExpirationDate = DateTime.UtcNow.AddHours(1)
            };
        RefreshToken child1 =
            new()
            {
                Token = "child-token-1",
                ReplacedByToken = "child-token-2",
                ExpirationDate = DateTime.UtcNow.AddHours(1)
            };
        RefreshToken child2 =
            new() { Token = "child-token-2", ReplacedByToken = null, ExpirationDate = DateTime.UtcNow.AddHours(1) };

        _refreshTokens.AddRange([ancestor, child1, child2]);

        await _authManager.RevokeDescendantRefreshTokens(ancestor, "127.0.0.1", "reuse-detected");

        Assert.NotNull(child1.RevokedDate);
        Assert.NotNull(child2.RevokedDate);
        Assert.Equal("127.0.0.1", child1.RevokedByIp);
        Assert.Equal("127.0.0.1", child2.RevokedByIp);
        Assert.Equal("reuse-detected", child1.ReasonRevoked);
        Assert.Equal("reuse-detected", child2.ReasonRevoked);

        _refreshTokenRepositoryMock.Verify(
            r => r.UpdateAsync(It.IsAny<RefreshToken>(), It.IsAny<CancellationToken>()),
            Times.Exactly(2)
        );
    }

    [Fact]
    public async Task RevokeDescendantRefreshTokens_ShouldStopGracefully_WhenDescendantTokenMissing()
    {
        RefreshToken ancestor =
            new()
            {
                Token = "ancestor-token",
                ReplacedByToken = "missing-child",
                ExpirationDate = DateTime.UtcNow.AddHours(1)
            };

        _refreshTokens.Add(ancestor);

        await _authManager.RevokeDescendantRefreshTokens(ancestor, "127.0.0.1", "reuse-detected");

        _refreshTokenRepositoryMock.Verify(
            r => r.UpdateAsync(It.IsAny<RefreshToken>(), It.IsAny<CancellationToken>()),
            Times.Never
        );
    }
}
