import pg from "pg";
import { env } from "../config/env.js";

export const pool = new pg.Pool({
  user: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  database: env.POSTGRES_DB,
  host: env.POSTGRES_HOST,
  port: env.POSTGRES_PORT,
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});
