
import { PrismaClient } from "@auth-system/database";

const db = new PrismaClient();

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function emailExists(email: string): Promise<boolean> {
  const normalizedEmail = normalizeEmail(email);

  const user = await db.user.findUnique({
    where: { email: normalizedEmail },
    select: { id: true },
  });

  return user !== null;
}