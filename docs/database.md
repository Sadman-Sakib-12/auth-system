# Database Design

## Database Technology

The project uses PostgreSQL as the primary relational database.

Prisma is used as the ORM and database access layer.

The database implementation is isolated inside:

`packages/database`

This keeps database access separate from application-specific business logic.

## Core Entities

### User

The `User` entity represents an authenticated account.

Important responsibilities include:

- Identity
- Email address
- Password hash
- Role
- Email verification state
- Account timestamps

The email address must be unique.

Passwords are never stored in plaintext.

Only the Argon2 password hash is persisted.

### Session

The `Session` entity represents an authenticated browser session.

A session belongs to exactly one user.

Important fields include:

- Session ID
- User ID
- Hashed session token
- Expiration time
- Revocation time
- Creation timestamp

The raw session token is never stored in the database.

Only its SHA-256 hash is persisted.

## Relationships

The primary relationship is:

`User 1 ──── N Session`

One user can have multiple sessions.

Each session belongs to exactly one user.

If a user is deleted, their sessions should also be removed through referential integrity.

## Constraints

The database should enforce important integrity rules rather than relying only on application code.

Examples:

- User email must be unique.
- Session token hash must be unique.
- Session must reference an existing user.
- Required fields must not be nullable.
- Role values must be restricted to supported application roles.

## Indexes

Indexes should exist on fields frequently used for lookup.

Important examples include:

- `User.email`
- `Session.tokenHash`
- `Session.userId`
- `Session.expiresAt`

Indexes should be added deliberately because unnecessary indexes increase storage and write overhead.

## Normalization

The schema follows a normalized relational design.

Authentication data is separated from session data.

A user does not contain multiple session records directly. Instead, sessions reference the user through a foreign key.

This avoids duplication and keeps session lifecycle management independent.

## Referential Integrity

Foreign-key relationships are enforced by PostgreSQL through Prisma.

A session cannot exist without its associated user.

User deletion behavior must prevent orphaned sessions.

## Data Ownership

`packages/database` owns database access and Prisma configuration.

The backend application owns business rules and request handling.

Controllers should not directly manage database connection configuration.

Services communicate with the database layer for persistence operations.

## ER Diagram

The database ER diagram is maintained separately using draw.io.

The diagram should represent at minimum:

- User
- Session
- User-to-Session relationship
- Primary keys
- Foreign keys
- Unique constraints
- Important indexes