# InfoSYS Fluxor Entegrasyonu - Başlangıç

## Tarih: 2025-12-18

## API Endpoints (Swagger'dan)

### Auth Controller
| Method | Endpoint | Request DTO | Notes |
|--------|----------|-------------|-------|
| POST | /api/Auth/Login | UserForLoginDto | email, password, authenticatorCode |
| POST | /api/Auth/Register | UserForRegisterDto | email (required) |
| GET | /api/Auth/RefreshToken | - | Cookie'den token |
| PUT | /api/Auth/RevokeToken | string | Token revoke |
| GET | /api/Auth/EnableEmailAuthenticator | - | 2FA Email |
| GET | /api/Auth/EnableOtpAuthenticator | - | 2FA OTP |
| GET | /api/Auth/VerifyEmailAuthenticator | ActivationKey (query) | |
| POST | /api/Auth/VerifyOtpAuthenticator | string | OTP code |

### OperationClaims Controller
| Method | Endpoint | Request DTO |
|--------|----------|-------------|
| GET | /api/OperationClaims/{Id} | - |
| GET | /api/OperationClaims | PageIndex, PageSize |
| POST | /api/OperationClaims | CreateOperationClaimCommand (name) |
| PUT | /api/OperationClaims | UpdateOperationClaimCommand (id, name) |
| DELETE | /api/OperationClaims | DeleteOperationClaimCommand (id) |

### UserOperationClaims Controller
| Method | Endpoint | Request DTO |
|--------|----------|-------------|
| GET | /api/UserOperationClaims/{Id} | - (UUID) |
| GET | /api/UserOperationClaims | PageIndex, PageSize |
| POST | /api/UserOperationClaims | CreateUserOperationClaimCommand (userId, operationClaimId) |
| PUT | /api/UserOperationClaims | UpdateUserOperationClaimCommand (id, userId, operationClaimId) |
| DELETE | /api/UserOperationClaims | DeleteUserOperationClaimCommand (id) |

### Users Controller
| Method | Endpoint | Request DTO |
|--------|----------|-------------|
| GET | /api/Users/{Id} | - (UUID) |
| GET | /api/Users/GetFromAuth | - |
| GET | /api/Users | PageIndex, PageSize |
| POST | /api/Users | CreateUserCommand (firstName, lastName, email, password) |
| PUT | /api/Users | UpdateUserCommand (id, firstName, lastName, email, password) |
| PUT | /api/Users/FromAuth | UpdateUserFromAuthCommand (id, firstName, lastName, password, newPassword) |
| DELETE | /api/Users | DeleteUserCommand (id) |

## Oluşturulacak Yapı
```
Frontend/InfoSYS.WebUI/
├── Store/
│   ├── Features/
│   │   ├── Auth/
│   │   ├── Users/
│   │   ├── OperationClaims/
│   │   ├── UserOperationClaims/
│   │   └── UI/
│   └── Middlewares/
├── Services/Api/
├── Models/DTOs/
└── Program.cs (güncellenecek)
```

## Paketler
- Fluxor.Blazor.Web
- Fluxor.Blazor.Web.ReduxDevTools
