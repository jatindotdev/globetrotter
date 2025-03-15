import { env } from "@/env";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

export const sql = postgres(env.DATABASE_URL, { prepare: false });
export const db = drizzle(sql);
