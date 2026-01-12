import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

// Priority: DATABASE_URL (Supabase) > POSTGRES_URL (Vercel Postgres)
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
const isLocal = connectionString?.includes("localhost");

const pool = new Pool({
    connectionString,
    ssl: isLocal ? false : { rejectUnauthorized: false },
});

export const db = drizzle(pool, { schema });
export { schema };
