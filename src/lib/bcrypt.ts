import bcrypt from "bcrypt";

export async function hashPassword(password: string): Promise<string> {
  const hashPassword = await bcrypt.hash(password, 10);
  return hashPassword;
}
