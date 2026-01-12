import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString) {
    console.error("❌ DATABASE_URL or POSTGRES_URL is missing!");
}

const isLocal = connectionString?.includes("localhost") || connectionString?.includes("127.0.0.1");

// Cấu hình SSL cực kỳ quan trọng cho Supabase/Vercel
const pool = new Pool({
    connectionString,
    ssl: isLocal ? false : { rejectUnauthorized: false },
    max: 10,
    connectionTimeoutMillis: 5000, // Tăng thêm thời gian chờ
});

// Lắng nghe lỗi kết nối để log ra server
pool.on('error', (err) => {
    console.error('CRITICAL: Unexpected error on idle client', err);
});

export const db = drizzle(pool, { schema });
export { schema };
