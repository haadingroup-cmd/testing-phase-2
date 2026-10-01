/**
 * Create (or reset the password of) an admin user.
 *
 *   npm run admin:create                      # interactive prompts
 *   ADMIN_EMAIL=a@b.com ADMIN_PASSWORD=... npm run admin:create
 *
 * Passwords are hashed with bcrypt; resetting a password also signs the user
 * out of every existing session.
 */
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { createScriptClient } from "../prisma/client";
import { hashPassword, passwordProblem } from "../src/lib/auth/password";

async function main() {
  const rl = createInterface({ input: stdin, output: stdout });
  const email = (process.env.ADMIN_EMAIL || (await rl.question("Admin email: "))).trim().toLowerCase();
  const name = process.env.ADMIN_NAME || (await rl.question("Display name [Administrator]: ")).trim() || "Administrator";
  const password = process.env.ADMIN_PASSWORD || (await rl.question("Password (12+ chars, upper, lower, number): "));
  rl.close();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Invalid email address.");
  const problem = passwordProblem(password);
  if (problem) throw new Error(problem);

  const db = createScriptClient();
  try {
    const passwordHash = await hashPassword(password);
    const user = await db.user.upsert({
      where: { email },
      create: { email, name, passwordHash },
      update: { passwordHash, name, sessionVersion: { increment: 1 } },
    });
    console.log(`Admin ready: ${user.email}. Sign in at /admin/login`);
  } finally {
    await db.$disconnect();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
