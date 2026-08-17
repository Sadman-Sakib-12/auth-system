# Architecture

## Project Overview

This project is a TypeScript monorepo for building a production-oriented authentication and authorization system.

## Applications

- `apps/frontend` — React + TypeScript + Vite frontend application.
- `apps/backend` — TypeScript backend API application.

## Shared Packages

- `packages/auth` — Authentication-related logic such as password hashing and token operations.
- `packages/database` — Prisma database layer for PostgreSQL.
- `packages/email` — Email delivery abstraction using Nodemailer.
- `packages/validation` — Shared Zod validation schemas.

## Architecture Principles

- Authentication and authorization are separate concerns.
- The backend is treated as a trust boundary.
- Frontend validation is for user experience; backend validation is mandatory.
- Shared packages have clear and limited responsibilities.
- Dependencies should flow from applications to the packages they require.