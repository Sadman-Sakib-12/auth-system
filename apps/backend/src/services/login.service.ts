import { prisma } from "@auth-system/database";
import { verifyPassword, generateSessionToken } from "auth";
import { normalizeEmail } from "../utils/email.js";
import { createSession } from "./session.service.js";

export async function loginUser(email: string, password: string) {
  const normalizedEmail = normalizeEmail(email);

  const user = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
    select: {
      id: true,
      name: true,
      email: true,
      passwordHash: true,
      role: true,
      emailVerified: true,
    },
  });

  if (!user) {
    return null;
  }

  const passwordValid = await verifyPassword(
    password,
    user.passwordHash,
  );

  if (!passwordValid) {
    return null;
  }

  const sessionToken = generateSessionToken();

  await createSession(user.id, sessionToken);

  return {
    sessionToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
    },
  };
}