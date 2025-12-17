namespace Domain.Entities;

public class EmailAuthenticator : InfoSystem.Core.Security.Entities.EmailAuthenticator<Guid>
{
    public virtual User User { get; set; } = default!;
}
