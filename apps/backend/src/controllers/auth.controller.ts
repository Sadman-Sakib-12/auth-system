import type { Request, Response } from "express";
import { registerSchema } from "../schemas/auth.schema.js";
import { createUser } from "../services/auth.service.js";
import { emailExists } from "../utils/email.js";
import { loginSchema } from "../schemas/auth.schema.js";
import { loginUser } from "../services/login.service.js";
import type { AuthenticatedRequest } from "../middleware/auth.types.js";
import { revokeSession } from "../services/session.service.js";
export async function register(req: Request, res: Response) {
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error.flatten().fieldErrors,
    });
  }

  const input = result.data;

  if (await emailExists(input.email)) {
    return res.status(409).json({
      message: "Email already exists",
    });
  }

  const user = await createUser(input);

  return res.status(201).json({
    message: "Registration successful",
    user,
  });
}
export async function login(req: Request, res: Response) {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error.flatten().fieldErrors,
    });
  }

  const { email, password } = result.data;

  const resultData = await loginUser(email, password);

  if (!resultData) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  res.cookie("session_token", resultData.sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7,
    path: "/",
  });

  return res.status(200).json({
    message: "Login successful",
    user: resultData.user,
  });
}
export async function me(
  req: AuthenticatedRequest,
  res: Response,
) {
  if (!req.user) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  return res.status(200).json({
    user: req.user,
  });
}
export async function logout(
  req: AuthenticatedRequest,
  res: Response,
) {
  const token = req.cookies?.session_token;

  if (token) {
    await revokeSession(token);
  }

  res.clearCookie("session_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return res.status(200).json({
    message: "Logout successful",
  });
}