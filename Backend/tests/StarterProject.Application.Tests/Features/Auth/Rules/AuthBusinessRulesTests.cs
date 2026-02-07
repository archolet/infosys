using Application.Features.Auth.Rules;
using Application.Services.Repositories;
using Domain.Entities;
using Moq;
using InfoSystem.Core.CrossCuttingConcerns.Exception.Types;
using InfoSystem.Core.Localization.Abstraction;
using InfoSystem.Core.Localization.Resource.Yaml;

namespace StarterProject.Application.Tests.Features.Auth.Rules;

public class AuthBusinessRulesTests
{
    private readonly AuthBusinessRules _authBusinessRules;

    public AuthBusinessRulesTests()
    {
        var userRepositoryMock = new Mock<IUserRepository>();
        ILocalizationService localizationService = new ResourceLocalizationManager(resources: [])
        {
            AcceptLocales = ["en"]
        };

        _authBusinessRules = new AuthBusinessRules(userRepositoryMock.Object, localizationService);
    }

    [Fact]
    public async Task RefreshTokenShouldBeActive_ShouldThrowBusinessException_WhenTokenIsRevoked()
    {
        RefreshToken refreshToken =
            new()
            {
                Token = "revoked-token",
                ExpirationDate = DateTime.UtcNow.AddMinutes(10),
                RevokedDate = DateTime.UtcNow
            };

        await Assert.ThrowsAsync<BusinessException>(() => _authBusinessRules.RefreshTokenShouldBeActive(refreshToken));
    }

    [Fact]
    public async Task RefreshTokenShouldBeActive_ShouldThrowBusinessException_WhenTokenIsExpired()
    {
        RefreshToken refreshToken =
            new()
            {
                Token = "expired-token",
                ExpirationDate = DateTime.UtcNow.AddMinutes(-1),
                RevokedDate = null
            };

        await Assert.ThrowsAsync<BusinessException>(() => _authBusinessRules.RefreshTokenShouldBeActive(refreshToken));
    }

    [Fact]
    public async Task RefreshTokenShouldBeActive_ShouldNotThrow_WhenTokenIsActive()
    {
        RefreshToken refreshToken =
            new()
            {
                Token = "active-token",
                ExpirationDate = DateTime.UtcNow.AddMinutes(10),
                RevokedDate = null
            };

        await _authBusinessRules.RefreshTokenShouldBeActive(refreshToken);
    }
}
