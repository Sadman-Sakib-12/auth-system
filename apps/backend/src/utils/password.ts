import { hashPassword } from "auth";

export async function createPasswordHash(
  password: string,
): Promise<string> {
  return hashPassword(password);
}
