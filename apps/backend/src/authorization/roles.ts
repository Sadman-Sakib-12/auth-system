export const ROLES = [
  "SUPER_ADMIN",
  "ADMIN",
  "MANAGER",
  "STAFF",
  "USER",
] as const;

export type Role = (typeof ROLES)[number];

export const ROLE_HIERARCHY: Record<Role, number> = {
  SUPER_ADMIN: 5,
  ADMIN: 4,
  MANAGER: 3,
  STAFF: 2,
  USER: 1,
};