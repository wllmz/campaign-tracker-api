import { z } from "zod";

export const portSchema = z.coerce
  .number()
  .refine((port) => port > 0 && port < 65536, {
    message: "must be a valid port number between 1 and 65535",
  });

export const envSchema = z.object({
  POSTGRES_USER: z.string().min(1, { message: "POSTGRES_USER is required" }),
  POSTGRES_PASSWORD: z
    .string()
    .min(1, { message: "POSTGRES_PASSWORD is required" }),
  POSTGRES_DB: z.string().min(1, { message: "POSTGRES_DB is required" }),
  POSTGRES_HOST: z.string().min(1, { message: "POSTGRES_HOST is required" }),
  POSTGRES_PORT: portSchema.default(5432),
  PORT: portSchema.default(3000),
});

const envResult = envSchema.safeParse(process.env);

if (!envResult.success) {
  console.error(
    "Invalid environment variables:\n" + z.prettifyError(envResult.error),
  );
  process.exit(1);
}

export const env = envResult.data;
