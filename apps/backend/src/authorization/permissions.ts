import {
  ROLE_HIERARCHY,
  type Role,
} from "./roles.js";

export function hasMinimumRole(
  userRole: Role,
  requiredRole: Role,
): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}