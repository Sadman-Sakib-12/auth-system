import type { NextFunction, Response } from "express";
import type { AuthenticatedRequest } from "./auth.types.js";
import type { Role } from "../authorization/roles.js";
import { hasMinimumRole } from "../authorization/permissions.js";

export function requireMinimumRole(requiredRole: Role) {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): void => {
    if (!req.user) {
      res.status(401).json({
        message: "Authentication required",
      });
      return;
    }

    if (!hasMinimumRole(req.user.role, requiredRole)) {
      res.status(403).json({
        message: "Insufficient permissions",
      });
      return;
    }

    next();
  };
}