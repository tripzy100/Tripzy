import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid connection URL"),
  UPSTASH_REDIS_REST_URL: z.string().url("UPSTASH_REDIS_REST_URL must be a valid URL"),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1, "UPSTASH_REDIS_REST_TOKEN is required"),
  BETTER_AUTH_SECRET: z.string().min(32, "BETTER_AUTH_SECRET must be at least 32 characters"),
  BETTER_AUTH_URL: z.string().url("BETTER_AUTH_URL must be a valid URL"),
  CLOUDINARY_CLOUD_NAME: z.string().min(1, "CLOUDINARY_CLOUD_NAME is required"),
  CLOUDINARY_API_KEY: z.string().min(1, "CLOUDINARY_API_KEY is required"),
  CLOUDINARY_API_SECRET: z.string().min(1, "CLOUDINARY_API_SECRET is required"),
  GOOGLE_MAPS_API_KEY: z.string().min(1, "GOOGLE_MAPS_API_KEY is required"),
  CASHFREE_APP_ID: z.string().min(1, "CASHFREE_APP_ID is required"),
  CASHFREE_SECRET_KEY: z.string().min(1, "CASHFREE_SECRET_KEY is required"),
  CASHFREE_ENV: z.enum(["sandbox", "production"]).default("sandbox"),
  RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY is required"),
  NEXT_PUBLIC_APP_URL: z.string().url("NEXT_PUBLIC_APP_URL must be a valid URL"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

// Since Next.js performs static rendering checks, we wrap the parse in a try-catch for build environments
// but fail loud and clear if required variables are missing during actual runtime.
let env: z.infer<typeof envSchema>;

try {
  env = envSchema.parse({
    DATABASE_URL: process.env.DATABASE_URL,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
    CASHFREE_APP_ID: process.env.CASHFREE_APP_ID,
    CASHFREE_SECRET_KEY: process.env.CASHFREE_SECRET_KEY,
    CASHFREE_ENV: process.env.CASHFREE_ENV,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NODE_ENV: process.env.NODE_ENV,
  });
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error("❌ Invalid environment variables:");
    console.error(JSON.stringify(error.format(), null, 2));
  } else {
    console.error("❌ Unknown error loading environment variables:", error);
  }
  // In dev/test, don't crash the build completely if variables are omitted, but warn heavily.
  if (process.env.NODE_ENV === "production") {
    throw new Error("Invalid environment variables. Production deployment halted.");
  } else {
    // Return mock values so developer server can boot
    env = {
      DATABASE_URL: process.env.DATABASE_URL || "postgresql://mock:mock@localhost:5432/mock",
      UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL || "https://mock.upstash.io",
      UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN || "mock_token",
      BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET || "mock_secret_longer_than_32_characters_long",
      BETTER_AUTH_URL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "mock_cloudinary_cloud",
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "mock_cloudinary_key",
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "mock_cloudinary_secret",
      GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY || "mock_google_maps_key",
      CASHFREE_APP_ID: process.env.CASHFREE_APP_ID || "mock_cashfree_app_id",
      CASHFREE_SECRET_KEY: process.env.CASHFREE_SECRET_KEY || "mock_cashfree_secret_key",
      CASHFREE_ENV: (process.env.CASHFREE_ENV as "sandbox" | "production") || "sandbox",
      RESEND_API_KEY: process.env.RESEND_API_KEY || "re_mock_key",
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      NODE_ENV: "development",
    };
  }
}

export { env };
