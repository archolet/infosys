using Application.Features.Auth.Commands.EnableEmailAuthenticator;
using Application.Features.Auth.Commands.EnableOtpAuthenticator;
using Application.Features.Auth.Commands.Login;
using Application.Features.Auth.Commands.RefreshToken;
using Application.Features.Auth.Commands.Register;
using Application.Features.Auth.Commands.RevokeToken;
using Application.Features.Auth.Commands.VerifyEmailAuthenticator;
using Application.Features.Auth.Commands.VerifyOtpAuthenticator;
using Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using InfoSystem.Core.Application.Dtos;

namespace WebAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : BaseController
{
    private readonly WebApiConfiguration _configuration;

    public AuthController(IConfiguration configuration)
    {
        const string configurationSection = "WebAPIConfiguration";
        _configuration =
            configuration.GetSection(configurationSection).Get<WebApiConfiguration>()
            ?? throw new NullReferenceException($"\"{configurationSection}\" section cannot found in configuration.");
    }

    [HttpPost("Login")]
    public async Task<IActionResult> Login([FromBody] UserForLoginDto userForLoginDto)
    {
        LoginCommand loginCommand = new() { UserForLoginDto = userForLoginDto, IpAddress = getIpAddress() };
        LoggedResponse result = await Mediator.Send(loginCommand);

        if (result.RefreshToken is not null)
            setRefreshTokenToCookie(result.RefreshToken);

        return Ok(result.ToHttpResponse());
    }

    [HttpPost("Register")]
    public async Task<IActionResult> Register([FromBody] UserForRegisterDto userForRegisterDto)
    {
        RegisterCommand registerCommand = new() { UserForRegisterDto = userForRegisterDto, IpAddress = getIpAddress() };
        RegisteredResponse result = await Mediator.Send(registerCommand);
        setRefreshTokenToCookie(result.RefreshToken);
        return Created(uri: "", result.AccessToken);
    }

    [HttpGet("RefreshToken")]
    public async Task<IActionResult> RefreshToken()
    {
        if (!tryGetRefreshTokenFromCookies(out string? refreshToken))
            return Unauthorized("Refresh token is not found in request cookies.");

        RefreshTokenCommand refreshTokenCommand =
            new() { RefreshToken = refreshToken!, IpAddress = getIpAddress() };
        RefreshedTokensResponse result = await Mediator.Send(refreshTokenCommand);
        setRefreshTokenToCookie(result.RefreshToken);
        return Created(uri: "", result.AccessToken);
    }

    [HttpPut("RevokeToken")]
    public async Task<IActionResult> RevokeToken([FromBody(EmptyBodyBehavior = EmptyBodyBehavior.Allow)] string? refreshToken)
    {
        string? tokenToRevoke = refreshToken;
        if (string.IsNullOrWhiteSpace(tokenToRevoke) && !tryGetRefreshTokenFromCookies(out tokenToRevoke))
            return Unauthorized("Refresh token is not found in request cookies.");

        RevokeTokenCommand revokeTokenCommand =
            new() { Token = tokenToRevoke!, IpAddress = getIpAddress() };
        RevokedTokenResponse result = await Mediator.Send(revokeTokenCommand);

        // Delete the refresh token cookie
        deleteRefreshTokenCookie();

        return Ok(result);
    }

    [HttpGet("EnableEmailAuthenticator")]
    public async Task<IActionResult> EnableEmailAuthenticator()
    {
        EnableEmailAuthenticatorCommand enableEmailAuthenticatorCommand =
            new()
            {
                UserId = getUserIdFromRequest(),
                VerifyEmailUrlPrefix = $"{_configuration.ApiDomain}/Auth/VerifyEmailAuthenticator"
            };
        await Mediator.Send(enableEmailAuthenticatorCommand);

        return Ok();
    }

    [HttpGet("EnableOtpAuthenticator")]
    public async Task<IActionResult> EnableOtpAuthenticator()
    {
        EnableOtpAuthenticatorCommand enableOtpAuthenticatorCommand = new() { UserId = getUserIdFromRequest() };
        EnabledOtpAuthenticatorResponse result = await Mediator.Send(enableOtpAuthenticatorCommand);

        return Ok(result);
    }

    [HttpGet("VerifyEmailAuthenticator")]
    public async Task<IActionResult> VerifyEmailAuthenticator(
        [FromQuery] VerifyEmailAuthenticatorCommand verifyEmailAuthenticatorCommand
    )
    {
        await Mediator.Send(verifyEmailAuthenticatorCommand);
        return Ok();
    }

    [HttpPost("VerifyOtpAuthenticator")]
    public async Task<IActionResult> VerifyOtpAuthenticator([FromBody] string authenticatorCode)
    {
        VerifyOtpAuthenticatorCommand verifyEmailAuthenticatorCommand =
            new() { UserId = getUserIdFromRequest(), ActivationCode = authenticatorCode };

        await Mediator.Send(verifyEmailAuthenticatorCommand);
        return Ok();
    }

    private bool tryGetRefreshTokenFromCookies(out string? refreshToken)
    {
        bool hasCookie = Request.Cookies.TryGetValue("refreshToken", out string? cookieValue);
        refreshToken = hasCookie && !string.IsNullOrWhiteSpace(cookieValue) ? cookieValue : null;
        return refreshToken is not null;
    }

    private void setRefreshTokenToCookie(RefreshToken refreshToken)
    {
        Response.Cookies.Append(
            key: "refreshToken",
            value: refreshToken.Token,
            options: createRefreshTokenCookieOptions(refreshToken.ExpirationDate)
        );
    }

    private void deleteRefreshTokenCookie()
    {
        bool isHttps = Request.IsHttps;
        Response.Cookies.Delete(
            key: "refreshToken",
            options: new CookieOptions
            {
                Path = "/",
                HttpOnly = true,
                Secure = isHttps,
                SameSite = isHttps ? SameSiteMode.None : SameSiteMode.Lax
            }
        );
    }

    private CookieOptions createRefreshTokenCookieOptions(DateTime expiresAt)
    {
        bool isHttps = Request.IsHttps;
        return new CookieOptions
        {
            HttpOnly = true,
            Secure = isHttps,
            SameSite = isHttps ? SameSiteMode.None : SameSiteMode.Lax,
            Expires = expiresAt,
            Path = "/",
            IsEssential = true
        };
    }
}
