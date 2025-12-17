namespace Domain.Entities;

public class OtpAuthenticator : InfoSystem.Core.Security.Entities.OtpAuthenticator<Guid>
{
    public virtual User User { get; set; } = default!;
}
