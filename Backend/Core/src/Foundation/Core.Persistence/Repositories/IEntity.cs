namespace InfoSystem.Core.Persistence.Repositories;

public interface IEntity<T>
{
    T Id { get; set; }
}
