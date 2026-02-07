using System.Text.RegularExpressions;
using FluentValidation;

namespace Application.Features.Users.Commands.UpdateFromAuth;

public class UpdateUserFromAuthCommandValidator : AbstractValidator<UpdateUserFromAuthCommand>
{
    private static readonly Regex StrongPasswordRegex = new(
        "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$",
        RegexOptions.Compiled
    );

    public UpdateUserFromAuthCommandValidator()
    {
        RuleFor(c => c.FirstName).NotEmpty().MinimumLength(2);
        RuleFor(c => c.LastName).NotEmpty().MinimumLength(2);
        RuleFor(c => c.Password).NotEmpty().MinimumLength(8);
        RuleFor(c => c.NewPassword)
            .Must(value => string.IsNullOrWhiteSpace(value) || StrongPassword(value))
            .WithMessage(
                "Your password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one special character."
            );
    }

    private static bool StrongPassword(string value)
    {
        return StrongPasswordRegex.IsMatch(value);
    }
}
