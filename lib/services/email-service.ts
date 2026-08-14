import { resend } from "@/lib/resend";
import { db } from "@/lib/db";
import { LogStatus } from "@prisma/client";

// Shared email wrapper layout
function emailContainer(content: string, previewText: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tripzy Tours</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #09090b; color: #f4f4f5; margin: 0; padding: 0; }
    .wrapper { width: 100%; max-width: 560px; margin: 0 auto; padding: 40px 20px; }
    .card { background-color: #18181b; border: 1px solid #27272a; border-radius: 16px; padding: 32px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5); }
    .brand { text-align: center; margin-bottom: 28px; }
    .brand-title { font-size: 24px; font-weight: 800; letter-spacing: -0.025em; color: #ffffff; text-decoration: none; display: inline-block; }
    .brand-subtitle { font-size: 12px; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 4px; }
    .heading { font-size: 20px; font-weight: 700; color: #ffffff; margin-top: 0; margin-bottom: 12px; }
    .text { font-size: 14px; line-height: 1.6; color: #a1a1aa; margin-bottom: 20px; }
    .otp-box { background: linear-gradient(135deg, rgba(16,185,129,0.1), rgba(13,148,136,0.1)); border: 1px solid rgba(16,185,129,0.3); border-radius: 12px; text-align: center; padding: 20px; margin: 24px 0; }
    .otp-code { font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #10b981; margin: 0; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; background-color: rgba(16,185,129,0.15); color: #10b981; font-size: 12px; font-weight: 600; margin-bottom: 16px; }
    .footer { text-align: center; font-size: 12px; color: #71717a; margin-top: 32px; line-height: 1.5; }
    .btn { display: inline-block; background-color: #10b981; color: #000000; font-weight: 700; font-size: 14px; text-decoration: none; padding: 12px 24px; border-radius: 8px; margin-top: 16px; }
  </style>
</head>
<body>
  <span style="display:none;font-size:1px;color:#09090b;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${previewText}</span>
  <div class="wrapper">
    <div class="brand">
      <div class="brand-title">🚗 TRIPZY</div>
      <div class="brand-subtitle">Premium Self-Drive Rentals</div>
    </div>
    <div class="card">
      ${content}
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Tripzy Tours. All rights reserved.</p>
      <p>If you did not request this email, please ignore it or contact security.</p>
    </div>
  </div>
</body>
</html>`;
}

export async function sendEmailVerificationOtp(
  userId: string | null,
  recipientEmail: string,
  otp: string,
): Promise<{ success: boolean; error?: string }> {
  const subject = `${otp} is your Tripzy verification code`;
  const previewText = `Your email verification code is ${otp}. Valid for 10 minutes.`;

  const html = emailContainer(
    `
    <div class="badge">Email Verification</div>
    <h1 class="heading">Verify your email address</h1>
    <p class="text">Welcome to Tripzy! Please enter the 6-digit verification code below to complete your registration and activate your self-drive account.</p>
    <div class="otp-box">
      <p class="otp-code">${otp}</p>
    </div>
    <p class="text" style="font-size:13px; text-align:center;">This code will expire in <strong>10 minutes</strong>. Do not share this OTP with anyone.</p>
    `,
    previewText,
  );

  return sendMail(userId, recipientEmail, subject, html);
}

export async function sendPasswordResetOtp(
  userId: string | null,
  recipientEmail: string,
  otp: string,
): Promise<{ success: boolean; error?: string }> {
  const subject = `${otp} is your Tripzy password reset code`;
  const previewText = `Use ${otp} to reset your password. Code expires in 10 minutes.`;

  const html = emailContainer(
    `
    <div class="badge" style="background-color:rgba(239,68,68,0.15); color:#ef4444;">Password Reset</div>
    <h1 class="heading">Reset your password</h1>
    <p class="text">We received a request to reset your Tripzy account password. Enter the 6-digit OTP code below to proceed with resetting your password.</p>
    <div class="otp-box" style="border-color:rgba(239,68,68,0.3); background:linear-gradient(135deg, rgba(239,68,68,0.1), rgba(185,28,28,0.1));">
      <p class="otp-code" style="color:#ef4444;">${otp}</p>
    </div>
    <p class="text" style="font-size:13px; text-align:center;">This code will expire in <strong>10 minutes</strong>. If you did not request a password reset, please secure your account immediately.</p>
    `,
    previewText,
  );

  return sendMail(userId, recipientEmail, subject, html);
}

export async function sendWelcomeEmail(
  userId: string | null,
  recipientEmail: string,
  name: string,
): Promise<{ success: boolean; error?: string }> {
  const subject = `Welcome to Tripzy Tours, ${name}! 🎉`;
  const previewText = `Your email has been verified. Welcome to premium self-drive rentals!`;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const html = emailContainer(
    `
    <div class="badge">Account Verified</div>
    <h1 class="heading">Welcome aboard, ${name}!</h1>
    <p class="text">Your email address has been successfully verified and your Tripzy account is now active.</p>
    <p class="text">To start booking self-drive vehicles for your adventures, please log in and complete your profile & KYC verification.</p>
    <div style="text-align:center;">
      <a href="${appUrl}/dashboard" class="btn">Go to Dashboard &rarr;</a>
    </div>
    `,
    previewText,
  );

  return sendMail(userId, recipientEmail, subject, html);
}

async function sendMail(
  userId: string | null,
  recipientEmail: string,
  subject: string,
  body: string,
): Promise<{ success: boolean; error?: string }> {
   try {
    const isDevMode =
      process.env.NODE_ENV !== "production" &&
      (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.startsWith("re_mock") || process.env.RESEND_API_KEY === "re_your_resend_api_key");

    if (isDevMode) {
      console.log("[EmailService] (DEV) Email not sent — logging to console:");
      console.log("  To:", recipientEmail);
      console.log("  Subject:", subject);
      console.log("  Preview (text):", body.replace(/<[^>]*>/g, "").trim().slice(0, 200));

      try {
        await db.emailSent.create({
          data: {
            userId,
            recipientEmail,
            subject,
            body,
            status: LogStatus.SENT,
            providerMessageId: null,
            errorReason: null,
          },
        });
      } catch (dbError) {
        console.error("[EmailService] Failed to log email in DB:", dbError);
      }

      return { success: true };
    }

    const resendFrom = process.env.RESEND_FROM_EMAIL || "Tripzy <notifications@tripzytours.in>";

    const { data, error } = await resend.emails.send({
      from: resendFrom,
      to: [recipientEmail],
      subject,
      html: body,
    });

    if (error) {
      console.error("[EmailService] Resend API error:", error);
    }

    // Record email status in Prisma DB
    try {
      await db.emailSent.create({
        data: {
          userId,
          recipientEmail,
          subject,
          body,
          status: error ? LogStatus.FAILED : LogStatus.SENT,
          providerMessageId: data?.id || null,
          errorReason: error?.message || null,
        },
      });
    } catch (dbError) {
      console.error("[EmailService] Failed to log email in DB:", dbError);
    }

    return { success: !error, error: error?.message };
  } catch (error: any) {
    console.error("[EmailService] Exception sending email:", error);
    return { success: false, error: error.message };
  }
}
