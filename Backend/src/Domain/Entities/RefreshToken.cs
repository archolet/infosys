namespace Domain.Entities;

public class RefreshToken : InfoSystem.Core.Security.Entities.RefreshToken<Guid, Guid>
{
    public virtual User User { get; set; } = default!;
}
