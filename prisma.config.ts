import "dotenv/config";
import { defineConfig } from "prisma/config";

// DATABASE_URL is read lazily so `prisma generate` (run on every install)
// works even before a database has been configured.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL ?? "",
  },
});
