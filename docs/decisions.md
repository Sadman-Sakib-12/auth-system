# Engineering Decisions

## Monorepo

The project uses a TypeScript monorepo to keep related applications and shared packages in one repository.

The monorepo contains:

- `apps/frontend`
- `apps/backend`
- `packages/auth`
- `packages/database`
- `packages/email`
- `packages/validation`

Packages exist only when they have a clear reusable responsibility.

## Backend Responsibility

The backend owns:

- Authentication
- Authorization
- Session management
- Request validation
- Database operations
- Security-sensitive decisions

The frontend is never trusted for security decisions.

## Authentication Strategy

The system uses server-managed opaque sessions rather than storing authentication state directly in browser-accessible JavaScript storage.

This reduces exposure of authentication credentials to client-side JavaScript.

## Why Argon2

Argon2 is used for password hashing because password storage requires a deliberately expensive password hashing function rather than a general-purpose cryptographic hash.

The application never stores plaintext passwords.

## Why JOSE

JOSE is included for standards-based cryptographic token operations where signed or encrypted token formats are required.

The authentication architecture keeps token-related cryptographic operations separate from business logic.

## Why Cookies

Cookies are used because the assignment explicitly requires cookie-based authentication.

Security-focused cookie attributes such as `httpOnly`, `secure`, and `sameSite` are used according to the deployment environment.

## Why Zod

Zod provides runtime validation at the application boundary while also providing TypeScript type inference.

Backend validation is mandatory because requests from clients cannot be trusted.

## Why Prisma

Prisma provides type-safe database access and keeps database queries consistent with the TypeScript type system.

## Why PostgreSQL

PostgreSQL provides relational constraints, foreign keys, unique constraints, indexes, and transactional guarantees required by the authentication system.

## Why Nodemailer

Nodemailer is used behind the email package abstraction.

The authentication system should not depend directly on a specific email provider.

This makes SMTP provider changes easier without changing authentication business logic.

## Why tsdown

Packages under `/packages/*` use tsdown as their package build system.

This keeps shared package compilation separate from application builds.

## Authentication vs Authorization

Authentication and authorization are deliberately separated.

Authentication determines whether a request belongs to a valid user.

Authorization determines whether that authenticated user has permission to perform an operation.

This distinction is reflected directly in the middleware architecture.

## Error Semantics

The system distinguishes between:

- `400` validation failures
- `401` authentication failures
- `403` authorization failures
- `409` resource conflicts

This makes API behavior predictable for clients.

## Trade-offs

The system favors explicit separation of responsibilities over minimizing the number of files.

This creates more modules but makes security-sensitive behavior easier to test, review, and explain during a technical discussion.