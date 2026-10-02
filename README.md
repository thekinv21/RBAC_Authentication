# Role Based Authentication & Authorization

A robust backend authentication and authorization system built with NestJS 11, PostgreSQL, and Prisma ORM.

[![NestJS](https://img.shields.io/badge/NestJS-11-informational?style=flat-square&logo=nestjs&logoColor=white)](<>)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0.2-blue?style=flat-square&logo=typescript&logoColor=white)](<>)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-latest-informational?style=flat-square&logo=postgresql&logoColor=white)](<>)
[![Prisma](https://img.shields.io/badge/Prisma-7-green?style=flat-square&logo=Prisma)](<>)


<img width="792" height="786" alt="Screenshot 2026-10-02 at 16 52 58" src="https://github.com/user-attachments/assets/cf4c064c-b7ee-4652-85b0-c934a5123f5b" />


## Description

This project implements a secure and scalable backend authentication and authorization system using the NestJS framework. It leverages PostgreSQL as the database and Prisma ORM for seamless data management. The system is designed to handle user registration, login, token management (access and refresh tokens), and role-based access control (RBAC).

Key features include JWT-based authentication, secure password hashing with Argon2, role management, and protection against common web vulnerabilities using Helmet and Arcjet.

## Features

- **Authentication:** Secure user registration and login.
- **JWT-based Auth:** Utilizes JSON Web Tokens for stateless authentication.
- **Token Management:** Handles generation and refresh of access and refresh tokens.
- **Role-Based Access Control (RBAC):** Implements role management for granular permissions.
- **Password Hashing:** Secures user passwords using Argon2.
- **Database Integration:** Seamlessly integrates with PostgreSQL using Prisma ORM.
- **API Versioning:** Supports API versioning via URI.
- **Security:** Implements security best practices with Helmet and Arcjet for rate limiting and protection.
- **Validation:** Uses `nestjs-zod` for robust request data validation.
- **Swagger UI:** Provides interactive API documentation via Swagger.
- **Custom Decorators:** Custom decorators such as `@Auth`, `@PreAuthorize`, `@ApiEndpoint` and `@CurrentUser`.
- **Token Revocation:** Instant revocation of access and refresh tokens via a per-user `tokenVersion`.

## Tech Stack

- **Backend Framework:** NestJS 11
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT, Argon2
- **Security:** Helmet, @arcjet/nest
- **Validation:** nestjs-zod
- **API Documentation:** Swagger
- **Package Manager:** Bun

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/thekinv21/RBAC_Authentication.git
   cd RBAC_Authentication
   ```

2. **Install dependencies:**

   ```bash
   bun install
   ```

3. **Set up environment variables:**
   Copy `.env.example` to `.env` and fill in the necessary variables:

   ```bash
   cp .env.example .env
   ```

   Ensure `DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `RESEND_API_KEY`, and `ARCJET_KEY` are properly configured.

4. **Database Migration:**
   Run database migrations using Prisma:

   ```bash
   bunx prisma migrate dev
   ```

5. **Generate Prisma Client:**
   ```bash
   bunx prisma generate
   ```

## Usage

This project provides a backend API for authentication and authorization. You can interact with the API using tools like Postman or by building a frontend application that consumes these endpoints.

### Key Endpoints:

- **Auth Management:**

  - `POST /api/auth/register`: Register a new user.
  - `POST /api/auth/login`: Log in a user and receive tokens.
  - `POST /api/auth/refresh-token`: Refresh access and refresh tokens.
  - `POST /api/auth/logout`: Log out the current user.

- **User Management:**

  - `GET /api/users`: Get all users (Admin only).
  - `POST /api/users`: Create a new user (Admin only).
  - `PUT /api/users`: Update a user (Admin only).
  - `PATCH /api/users/toggle/:id`: Toggle user active status (Admin only).
  - `DELETE /api/users/delete/:id`: Delete a user (Admin only).

- **Role Management:**

  - `GET /api/roles/find-all`: Get all roles. (Admin only)
  - `GET /api/roles/find-by-pagination`: Get roles with pagination. (Admin only)
  - `GET /api/roles/find-by-unique/:id`: Get a role by ID. (Admin only)
  - `POST /api/roles`: Create a new role (Admin only).
  - `PUT /api/roles`: Update a role (Admin only).
  - `PATCH /api/roles/toggle/:id`: Toggle role active status (Admin only).
  - `DELETE /api/roles/delete/:id`: Delete a role (Admin only).

### Running the Application:

- **Development:**

  ```bash
  bun run start:dev
  ```

- **Production:**
  ```bash
  bun run build
  bun run start:prod
  ```

## How to use

This project serves as a backend foundation for applications requiring secure user management and access control. It can be integrated with various frontend frameworks (React, Vue, Angular) or used as a standalone API service.

**Typical Workflow:**

1. **User Registration:** A new user registers via the `/api/auth/register` endpoint.
2. **User Login:** The user logs in using their credentials via `/api/auth/login`, receiving JWT access and refresh tokens.
3. **Authenticated Requests:** The frontend includes the `Authorization: Bearer <accessToken>` header in subsequent requests to protected API endpoints.
4. **Role-Based Authorization:** The `@PreAuthorize` decorator on controller methods ensures that only users with specific roles can access certain resources.
5. **Token Refresh:** When the access token expires, the frontend uses the refresh token with the `/api/auth/refresh-token` endpoint to obtain a new token pair.

## Project Structure

```
RBAC_Authentication/
├── .env.example
├── .husky/
├── .oxlintrc.json
├── .prettierrc
├── CLAUDE.md
├── README.md
├── bun.lock
├── nest-cli.json
├── package.json
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── schema/
├── tsconfig.json
└── src/
    ├── common/
    │   ├── constants/
    │   ├── decorators/
    │   ├── dto/
    │   ├── filters/
    │   ├── guards/
    │   ├── interceptors/
    │   ├── pipes/
    │   └── types/
    ├── config/
    ├── lib/
    │   ├── arcjet/
    │   └── prisma/
    ├── main.ts
    └── modules/
        ├── auth/
        │   ├── dto/
        │   ├── jwt/
        │   ├── AuthController.ts
        │   ├── AuthModule.ts
        │   └── AuthService.ts
        ├── role/
        │   ├── dto/
        │   ├── RoleController.ts
        │   ├── RoleModule.ts
        │   └── RoleService.ts
        ├── user/
        │   ├── dto/
        │   ├── UserController.ts
        │   ├── UserModule.ts
        │   └── UserService.ts
        └── AppModule.ts
```

## API Reference

The API is documented using Swagger. You can access the interactive documentation by running the application in development mode and navigating to `/docs`.

For example, if the app is running on `http://localhost:4200`:

- **Swagger UI:** `http://localhost:4200/docs`

This documentation details all available endpoints, request/response formats, and authorization requirements.

## Custom Decorators

```ts
@Auth()
@Controller('users')
export class UserController {
  @Get()
  @PreAuthorize(RoleConstant.ADMIN)
  @ApiEndpoint({ summary: 'Get all users', type: UserDto, isArray: true })
  findAll() {}

  @Post('logout')
  @ApiEndpoint({ summary: 'Log out' })
  logout(@CurrentUser('sub') userId: string) {}
}
```

## Token Revocation

Access and refresh tokens are JWTs, but they can still be revoked instantly. Each user has a `tokenVersion` integer in the database, and every token carries the version it was issued with.

**How it works**

1. On login, `tokenVersion` is incremented and the new value is embedded in both the access and refresh token.
2. On every protected request, `JwtAuthGuard` verifies the token signature and then loads the user from the database. The request is rejected with `401` if the user no longer exists, is inactive, or if `payload.tokenVersion !== user.tokenVersion`.
3. Roles are also read from the database on each request (only active roles), so role changes apply immediately instead of waiting for the token to expire.
4. Refresh tokens are single-use: `POST /api/auth/refresh-token` atomically increments `tokenVersion` only if the presented version still matches, so a replayed or stolen refresh token fails.

**What revokes tokens (increments `tokenVersion`)**

| Action                              | Effect                                        |
| ----------------------------------- | --------------------------------------------- |
| Login                               | Tokens from earlier sessions are revoked      |
| Token refresh                       | The old access and refresh tokens are revoked |
| Logout                              | All access and refresh tokens are revoked     |
| Admin updates a user                | The user's tokens are revoked                 |
| Admin toggles a user's active state | The user's tokens are revoked                 |

Additional hardening in `JwtTokenService`: HS256 only, separate access/refresh secrets (at least 32 characters, must differ), issuer and audience checks, a token `typ` claim, and a unique `jti` per token

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository.**
2. **Create a new branch:** `git checkout -b feature/your-feature-name`.
3. **Make your changes.**
4. **Commit your changes:** `git commit -m 'feat: Add some amazing feature'`.
5. **Push to the branch:** `git push origin feature/your-feature-name`.
6. **Open a Pull Request.**
