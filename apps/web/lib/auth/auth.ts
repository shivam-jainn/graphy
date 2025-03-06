import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../database/db";
import { usersTable, sessionsTable, accountsTable, verificationsTable }  from "../database/schemas/auth-schema";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
          user: usersTable,
          session: sessionsTable,
          account: accountsTable,
          verification: verificationsTable
      }
    }),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID ?? '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? ''
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ''
    }
  },
  session: {
    expiresIn: 30 * 24 * 60 * 60
  }
});