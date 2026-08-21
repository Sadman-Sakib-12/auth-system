import type { Request } from "express";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "MANAGER" | "STAFF" | "USER";
};

export type AuthenticatedRequest = Request & {
  user?: AuthUser;
};