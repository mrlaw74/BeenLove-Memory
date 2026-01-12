import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({
    path: ".env.local",
});

// Use DATABASE_URL if provided (preferred for Supabase), otherwise fallback to POSTGRES_URL
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

export default defineConfig({
    schema: "./src/db/schema.ts",
    dialect: "postgresql",
    dbCredentials: {
        url: connectionString!,
        ssl: {
            rejectUnauthorized: false,
        },
    },
});
