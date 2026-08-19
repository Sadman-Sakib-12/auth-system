import { PrismaClient } from "@auth-system/database";
import { hashPassword } from "auth";
import type { RegisterInput } from "../schemas/auth.schema.js";
import { normalizeEmail } from "../utils/email.js";

const db = new PrismaClient();

export async function createUser(input: RegisterInput) {
  const email = normalizeEmail(input.email);
  const passwordHash = await hashPassword(input.password);

  return db.user.create({
    data: {
      name: input.name.trim(),
      email,
      passwordHash,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      emailVerified: true,
      createdAt: true,
    },
  });
}
