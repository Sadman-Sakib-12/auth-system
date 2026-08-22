# Security Design

## Authentication

Authentication verifies the identity of a user.

The backend authenticates users using server-managed sessions stored in secure cookies.

Authentication and authorization are treated as separate concerns.

Authentication answers:

"Who is this user?"

Authorization answers:

"What is this user allowed to do?"

## Password Security

Passwords are hashed using Argon2 before they are stored.

Plaintext passwords are never persisted.

During login, the submitted password is verified against the stored Argon2 hash.

Password hashing and verification are kept inside the shared authentication package.

## Session Security

The application uses opaque random session tokens.

The raw session token is sent to the browser through an authentication cookie.

Only a SHA-256 hash of the session token is stored in PostgreSQL.

This means a database leak does not directly reveal active session tokens.

Sessions have an expiration time and can also be revoked.

## Cookie Security

Authentication cookies should use security-focused browser attributes.

Recommended configuration:

- `httpOnly: true`
- `secure: true` in production
- `sameSite: "lax"` when compatible with the deployment architecture
- Explicit cookie expiration or max-age
- A restricted cookie path where appropriate

`httpOnly` prevents normal JavaScript access to the authentication cookie.

`secure` ensures the cookie is transmitted only over HTTPS in production.

`sameSite` provides protection against cross-site request behavior.

## Authorization

Authorization is implemented using role-based access control.

Supported roles are:

- `SUPER_ADMIN`
- `ADMIN`
- `MANAGER`
- `STAFF`
- `USER`

The system implements two authorization approaches:

- Exact role checks through `requireRole()`
- Minimum role checks through `requireMinimumRole()`

## Auth Gate

The authentication middleware verifies that a valid authenticated user exists before protected resources can be accessed.

Unauthenticated requests receive:

`401 Unauthorized`

## Role Gate

The role middleware verifies whether the authenticated user has permission to access a protected resource.

Authenticated users without sufficient permissions receive:

`403 Forbidden`

This keeps authentication failures separate from authorization failures.

## Validation

All externally supplied backend request data must be validated with Zod.

Frontend validation improves user experience but does not replace backend validation.

The backend remains the final trust boundary.

## CORS

CORS must be configured according to the actual frontend and backend deployment origins.

Credentialed requests require explicit allowed origins.

Wildcard origins should not be used with credentialed authentication requests.

## Sensitive Information

The API should avoid exposing:

- Password hashes
- Raw session tokens
- Internal database errors
- Sensitive authentication details

Authentication failures should return safe, predictable error messages.

## Failure Handling

The authentication system must handle:

- Invalid credentials
- Duplicate email registration
- Expired sessions
- Revoked sessions
- Missing authentication cookies
- Invalid session tokens
- Insufficient roles
- Validation failures
- Database failures

Errors should fail safely without exposing sensitive internal information.

## Security Principle

The backend is a trust boundary.

Every protected operation must perform server-side authentication, authorization, and validation regardless of what the frontend claims.