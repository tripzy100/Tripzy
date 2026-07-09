import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid connection URL"),
  DIRECT_URL: z.string().url("DIRECT_URL must be a valid connection URL").optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, "SUPABASE_SERVICE_ROLE_KEY is required"),
  CLOUDINARY_CLOUD_NAME: z.string().min(1, "CLOUDINARY_CLOUD_NAME is required"),
  CLOUDINARY_API_KEY: z.string().min(1, "CLOUDINARY_API_KEY is required"),
  CLOUDINARY_API_SECRET: z.string().min(1, "CLOUDINARY_API_SECRET is required"),
  GOOGLE_MAPS_API_KEY: z.string().min(1, "GOOGLE_MAPS_API_KEY is required"),
  CASHFREE_APP_ID: z.string().min(1, "CASHFREE_APP_ID is required"),
  CASHFREE_SECRET_KEY: z.string().min(1, "CASHFREE_SECRET_KEY is required"),
  CASHFREE_ENV: z.enum(["sandbox", "production"]).default("sandbox"),
  RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY is required"),
  MSG91_AUTH_KEY: z.string().min(1, "MSG91_AUTH_KEY is required"),
  MSG91_SENDER_ID: z.string().min(1, "MSG91_SENDER_ID is required"),
  MSG91_ROUTE: z.string().min(1, "MSG91_ROUTE is required"),
  NEXT_PUBLIC_APP_URL: z.string().url("NEXT_PUBLIC_APP_URL must be a valid URL"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

let env: z.infer<typeof envSchema>;

try {
  env = envSchema.parse({
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
    CASHFREE_APP_ID: process.env.CASHFREE_APP_ID,
    CASHFREE_SECRET_KEY: process.env.CASHFREE_SECRET_KEY,
    CASHFREE_ENV: process.env.CASHFREE_ENV,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    MSG91_AUTH_KEY: process.env.MSG91_AUTH_KEY,
    MSG91_SENDER_ID: process.env.MSG91_SENDER_ID,
    MSG91_ROUTE: process.env.MSG91_ROUTE,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NODE_ENV: process.env.NODE_ENV,
  });
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error("Invalid environment variables:");
    console.error(JSON.stringify(error.format(), null, 2));
  } else {
    console.error("Unknown error loading environment variables:", error);
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error("Invalid environment variables. Production deployment halted.");
  } else {
    env = {
      DATABASE_URL: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/tripzy",
      DIRECT_URL: process.env.DIRECT_URL,
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mock.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "mock_anon_key",
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || "mock_service_role_key",
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "mock_cloud",
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "mock_key",
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "mock_secret",
      GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY || "mock_key",
      CASHFREE_APP_ID: process.env.CASHFREE_APP_ID || "mock_id",
      CASHFREE_SECRET_KEY: process.env.CASHFREE_SECRET_KEY || "mock_key",
      CASHFREE_ENV: (process.env.CASHFREE_ENV as "sandbox" | "production") || "sandbox",
      RESEND_API_KEY: process.env.RESEND_API_KEY || "re_mock_key",
      MSG91_AUTH_KEY: process.env.MSG91_AUTH_KEY || "mock_msg91_key",
      MSG91_SENDER_ID: process.env.MSG91_SENDER_ID || "TRIPZY",
      MSG91_ROUTE: process.env.MSG91_ROUTE || "4",
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      NODE_ENV: "development",
    };
  }
}

export { env };
