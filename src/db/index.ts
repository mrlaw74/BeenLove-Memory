import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString) {
    console.error("❌ DATABASE_URL or POSTGRES_URL is missing! Please check Vercel Environment Variables.");
}

const isLocal = connectionString?.includes("localhost") || connectionString?.includes("127.0.0.1");

const pool = new Pool({
    connectionString,
    // Supabase/Vercel require SSL in production. rejectUnauthorized: false is often needed for self-signed certs.
    ssl: isLocal ? false : { rejectUnauthorized: false },
    max: 10,        // Limit pooling for serverless
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
});

export const db = drizzle(pool, { schema });
export { schema };
