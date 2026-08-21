import type { NextFunction, Response } from "express";
import type { AuthenticatedRequest } from "./auth.types.js";
import type { Role } from "../authorization/roles.js";

export function requireRole(...allowedRoles: Role[]) {
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

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        message: "Forbidden",
      });
      return;
    }

    next();
  };
}