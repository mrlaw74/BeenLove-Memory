import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

// Ưu tiên DATABASE_URL (nên đặt tên này trên Vercel để tránh trùng lặp)
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString) {
    console.error("❌ DATABASE_URL or POSTGRES_URL is missing!");
}

const isLocal = connectionString?.includes("localhost") || connectionString?.includes("127.0.0.1");

const pool = new Pool({
    connectionString,
    // Supabase cần SSL ở môi trường production
    ssl: isLocal ? false : {
        rejectUnauthorized: false
    },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
    console.error('CRITICAL: Unexpected error on idle client', err);
});

export const db = drizzle(pool, { schema });
export { schema };

