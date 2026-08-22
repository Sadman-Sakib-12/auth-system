# Failure Analysis

## Registration Failures

### Invalid Input

If registration data fails Zod validation, the backend returns `400 Bad Request`.

The database operation is not executed.

### Duplicate Email

If the normalized email already exists, registration returns `409 Conflict`.

The database also enforces email uniqueness to protect against race conditions.

### Database Failure

Unexpected database failures must not expose raw database errors to the client.

The server should return a safe error response and log the internal failure appropriately.

## Login Failures

### Invalid Credentials

Invalid email or password must not reveal which credential was incorrect.

The API should return a generic authentication failure response.

### Missing User

A login attempt for an unknown email must fail safely without exposing account existence unnecessarily.

### Password Verification Failure

If Argon2 verification fails, authentication must be rejected.

No session should be created.

## Session Failures

### Missing Cookie

A protected request without an authentication cookie returns:

`401 Unauthorized`

### Invalid Session Token

If the supplied session token does not match a stored session hash, authentication fails.

### Expired Session

Expired sessions cannot authenticate requests.

The user must authenticate again.

### Revoked Session

A revoked session cannot be reused.

### Database Session Lookup Failure

A database failure during session validation must fail closed.

The application must not treat an unknown database state as an authenticated session.

## Authorization Failures

### Unauthenticated Request

A request without valid authentication receives:

`401 Unauthorized`

### Insufficient Role

An authenticated user without the required role receives:

`403 Forbidden`

Authentication and authorization failures remain distinguishable.

## Cookie Failures

The authentication cookie must not be accepted as proof of identity by itself.

The backend must validate the corresponding session.

Security attributes must be configured appropriately for the deployment environment.

## Validation Failures

All externally supplied backend data must pass Zod validation.

Invalid data must be rejected before business logic or database operations continue.

## Security Failure Principles

The system follows these principles:

- Fail closed for authentication and authorization.
- Never trust frontend authentication state.
- Never expose passwords or password hashes.
- Never expose raw session tokens.
- Avoid leaking sensitive internal errors.
- Validate all external input.
- Enforce critical constraints at the database level.

## Unresolved Problems

The following areas may require additional hardening before production deployment:

- Rate limiting for login attempts
- Account lockout or abuse detection
- CSRF protection strategy depending on deployment architecture
- Session cleanup for expired records
- Centralized production error logging
- Email verification and password reset flows
- Security monitoring and audit logging

These are documented explicitly so they can be addressed rather than being treated as hidden assumptions.