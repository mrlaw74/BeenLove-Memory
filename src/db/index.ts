import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

// LOG DEBUG: Giúp bạn biết chính xác hostname đang dùng (đã ẩn password)
if (connectionString) {
    const masked = connectionString.replace(/:([^:@]+)@/, ':****@');
    console.log("🔌 Connecting to DB:", masked);
}

const isLocal = connectionString?.includes("localhost") || connectionString?.includes("127.0.0.1");

let pool: Pool;

if (isLocal) {
    pool = new Pool({
        connectionString,
        ssl: false,
    });
} else {
    pool = new Pool({
        connectionString,
        ssl: { rejectUnauthorized: false },
        max: 1,
        connectionTimeoutMillis: 10000,
        idleTimeoutMillis: 20000,
    });
}

pool.on('error', (err) => {
    console.error('Database Pool Error:', err);
});

export const db = drizzle(pool, { schema });
export { schema };
