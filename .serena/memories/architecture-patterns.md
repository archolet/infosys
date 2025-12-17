# InfoSYS Architecture Patterns

## CQRS Pattern
- Commands: `{Action}Command` with nested `{Action}CommandHandler`
- Queries: `GetById{Entity}Query`, `GetList{Entity}Query`
- All handlers implement `IRequestHandler<TRequest, TResponse>`

## Business Rules Pattern
- Class: `{Feature}BusinessRules` extends `BaseBusinessRules`
- Method naming: `{Entity}{Field}Should{Condition}`
- Example: `UserEmailShouldNotExistsWhenInsert`

## Repository Pattern
- Interface: `I{Entity}Repository` in Application layer
- Implementation: `{Entity}Repository` in Persistence layer
- Base: `EfRepositoryBase<TEntity, TId, TContext>`

## Key Files
- User entity: `Domain/Entities/User.cs`
- User commands: `Application/Features/Users/Commands/`
- User business rules: `Application/Features/Users/Rules/UserBusinessRules.cs`
