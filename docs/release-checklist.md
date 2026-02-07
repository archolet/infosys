# InfoSYS Release Checklist

## 1. Environment and Secrets
- `ConnectionStrings__BaseDb` is set for target environment.
- `TokenOptions__SecurityKey` is production-grade and rotated.
- `WebAPIConfiguration__AllowedOrigins` only includes trusted frontend domains.
- `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` are configured securely.

## 2. Security and Session
- HTTPS is enforced in production.
- Refresh token cookie flags are verified (`HttpOnly`, `Secure`, `SameSite`, `Path`).
- Login, refresh, revoke, and post-revoke refresh behavior is validated.

## 3. Database and Seed
- Migrations are applied successfully at startup.
- Admin seed user and role mappings exist.
- Manual login with seeded admin account is validated in non-production environments.

## 4. Build and Quality Gates
- Backend `dotnet build` passes.
- Backend tests pass.
- Frontend `lint`, `format:check`, and `build` pass.
- Auth smoke flow (`scripts/smoke-auth-flow.sh`) passes.
- Release preflight passes (`make preflight` or `make preflight-strict`).
- Deploy dry-run passes (`make deploy-dry-run`).

## 5. Runtime Verification
- API health endpoint (`/swagger/index.html`) is reachable.
- Frontend root and login routes are reachable.
- Docker PostgreSQL health check is green.

## 6. Operational Readiness
- Logging is configured and logs are accessible.
- Rollback path is documented (previous image/tag + DB backup strategy).
- Post-deploy verification owner and sign-off are assigned.
