import type { NextFunction, Response } from "express";
import { getSessionUser } from "../services/session.service.js";
import type { AuthenticatedRequest } from "./auth.types.js";

export async function loadAuthUser(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const token = req.cookies?.session_token;

  if (!token) {
    next();
    return;
  }

  const user = await getSessionUser(token);

  if (user) {
    req.user = user;
  }

  next();
}

export function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void {
  if (!req.user) {
    res.status(401).json({
      message: "Authentication required",
    });
    return;
  }

  next();
}