import { db } from "@/lib/db";
import { createServiceClient } from "@/lib/supabase";
import { sendOtp, verifyOtp } from "@/features/auth/services/otp-service";
import { sendWelcomeEmail } from "@/lib/services/email-service";
import { createOrUpdateUserProfile } from "@/lib/services/profile-service";
import {
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  RegisterInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from "@/lib/services/validation-service";

export interface VerifyEmailOtpResult {
  success: boolean;
  message: string;
  user?: { id: string; email: string };
  credentials?: { email: string; password: string };
}

export async function registerUser(input: RegisterInput) {
  // 1. Validate inputs
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message || "Invalid registration data";
    return { success: false, message: firstError };
  }

  const { name, email, password } = parsed.data;

  // 2. Check if account already exists in Prisma DB
  const existingDbUser = await db.user.findUnique({
    where: { email },
  });

  if (existingDbUser) {
    return {
      success: false,
      message: "An account with this email address already exists. Please sign in.",
    };
  }

  // 3. Encrypt temporary pending signup data and send 6-digit Email Verification OTP via Resend
  // DO NOT create Supabase Auth user or Prisma User record yet!
  const otpResult = await sendOtp(email, "EMAIL_VERIFICATION", null, {
    name,
    email,
    password,
  });

  if (!otpResult.success) {
    return otpResult;
  }

  return {
    success: true,
    requiresVerification: true,
    message: otpResult.message || "Please check your email for the 6-digit verification code.",
    email,
  };
}

export async function verifyEmailOtp(email: string, otp: string): Promise<VerifyEmailOtpResult> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanOtp = otp.trim();

  // 1. Verify OTP server-side and extract encrypted pending signup payload
  const verifyResult = await verifyOtp(cleanEmail, cleanOtp, "EMAIL_VERIFICATION");
  if (!verifyResult.success) {
    return { success: false, message: verifyResult.message };
  }

  const pendingData = verifyResult.payload;
  if (!pendingData || !pendingData.email || !pendingData.password) {
    // Fallback: check if user record already exists in DB
    const existingUser = await db.user.findUnique({ where: { email: cleanEmail } });
    if (existingUser) {
      await db.user.update({
        where: { id: existingUser.id },
        data: { emailVerified: true, status: "ACTIVE" },
      });
      const supabaseAdmin = createServiceClient();
      await supabaseAdmin.auth.admin.updateUserById(existingUser.id, { email_confirm: true });
      return {
        success: true,
        message: "Email verified successfully! Logging you in...",
        user: { id: existingUser.id, email: existingUser.email },
      };
    }

    return {
      success: false,
      message: "Pending signup data has expired or is invalid. Please register again.",
    };
  }

  const { name, password } = pendingData;

  // 2. Create the user in Supabase Auth via Admin Service Role Client (email_confirm: true)
  const supabaseAdmin = createServiceClient();
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: cleanEmail,
    password,
    email_confirm: true,
    user_metadata: { name, role: "USER" },
  });

  if (authError || !authData.user) {
    console.error("[AuthService] Post-verification Supabase createUser error:", authError);
    return {
      success: false,
      message: authError?.message || "Failed to create user account in authentication provider.",
    };
  }

  const userId = authData.user.id;

  // 3. Create active, verified user record in Prisma DB
  const user = await db.user.create({
    data: {
      id: userId,
      email: cleanEmail,
      passwordHash: "", // Securely managed by Supabase Auth
      emailVerified: true,
      phoneVerified: false,
      isKycVerified: false,
      status: "ACTIVE",
    },
  });

  // Create User Profile
  await createOrUpdateUserProfile(userId, name);

  // Assign default USER role
  const defaultRole = await db.role.findFirst({ where: { code: "USER" } });
  if (defaultRole) {
    await db.userRole.create({
      data: {
        userId,
        roleId: defaultRole.id,
      },
    });
  }

  // 4. Send Welcome Email via Resend
  await sendWelcomeEmail(userId, cleanEmail, name);

  return {
    success: true,
    message: "Email verified & account created successfully! Logging you in...",
    user: { id: user.id, email: user.email },
    credentials: { email: cleanEmail, password },
  };
}

export async function resendVerificationCode(email: string) {
  const cleanEmail = email.trim().toLowerCase();

  // Check if user already exists
  const existingUser = await db.user.findUnique({
    where: { email: cleanEmail },
  });

  if (existingUser) {
    return { success: false, message: "An account with this email already exists. Please sign in." };
  }

  return await sendOtp(cleanEmail, "EMAIL_VERIFICATION");
}

export async function forgotPassword(input: ForgotPasswordInput) {
  const parsed = forgotPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Please enter a valid email address." };
  }

  const { email } = parsed.data;

  // Check user exists
  const user = await db.user.findUnique({
    where: { email },
  });

  if (!user) {
    return {
      success: true,
      message: "If an account exists with that email, a password reset code has been sent.",
    };
  }

  const otpResult = await sendOtp(email, "PASSWORD_RESET", user.id);
  return {
    success: true,
    message: otpResult.message || "Password reset code sent to your email.",
  };
}

export async function resetPassword(input: ResetPasswordInput) {
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message || "Invalid input data";
    return { success: false, message: firstError };
  }

  const { email, otp, newPassword } = parsed.data;

  // 1. Verify Password Reset OTP server-side
  const verifyResult = await verifyOtp(email, otp, "PASSWORD_RESET");
  if (!verifyResult.success) {
    return { success: false, message: verifyResult.message };
  }

  // 2. Find user in Prisma DB
  const user = await db.user.findUnique({
    where: { email },
  });

  if (!user) {
    return { success: false, message: "Account not found." };
  }

  // 3. Update password in Supabase Auth via Admin Service Role Client
  const supabaseAdmin = createServiceClient();
  const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
    password: newPassword,
  });

  if (updateError) {
    console.error("[AuthService] Reset password error:", updateError);
    return { success: false, message: updateError.message || "Failed to update password." };
  }

  // 4. Invalidate all existing sessions / tokens for the user in Supabase
  try {
    await supabaseAdmin.auth.admin.signOut(user.id, "global");
  } catch (err) {
    console.error("[AuthService] Error revoking sessions:", err);
  }

  return {
    success: true,
    message: "Password reset successfully! Please sign in with your new password.",
  };
}
