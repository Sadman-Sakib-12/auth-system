import { prisma } from "@auth-system/database";
import { hashSessionToken } from "../utils/session.js";

const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7;

export async function createSession(userId: string, token: string) {
  const tokenHash = hashSessionToken(token);
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  return prisma.session.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
    },
    select: {
      id: true,
      userId: true,
      expiresAt: true,
    },
  });
}

export async function getSessionUser(token: string) {
  const tokenHash = hashSessionToken(token);

  const session = await prisma.session.findUnique({
    where: {
      tokenHash,
    },
    select: {
      expiresAt: true,
      revokedAt: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  if (!session) {
    return null;
  }

  if (session.revokedAt || session.expiresAt <= new Date()) {
    return null;
  }

  return session.user;
}
export async function revokeSession(token: string): Promise<void> {
  const tokenHash = hashSessionToken(token);

  await prisma.session.updateMany({
    where: {
      tokenHash,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
}