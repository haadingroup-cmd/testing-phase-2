// Used by `vercel-build`: applies pending migrations when DATABASE_URL is set.
// Without a database the build continues (the public site renders from the
// default content), so a first deploy never fails just because the DB isn't
// connected yet.
import { execSync } from "node:child_process";

if (!process.env.DATABASE_URL) {
  console.warn("[migrate] DATABASE_URL is not set — skipping `prisma migrate deploy`.");
} else {
  execSync("npx prisma migrate deploy", { stdio: "inherit" });
}
