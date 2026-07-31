import { db } from "@/lib/db";

export interface UserProfileData {
  id: string;
  email: string;
  name: string;
  role: string;
  emailVerified: boolean;
  isKycVerified: boolean;
  status: string;
  createdAt: Date;
  profile: {
    firstName: string;
    lastName: string;
    avatarUrl?: string | null;
  } | null;
}

export async function getUserProfile(userId: string): Promise<UserProfileData | null> {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      userRoles: {
        include: {
          role: true,
        },
      },
    },
  });

  if (!user) return null;

  const primaryRole = user.userRoles[0]?.role?.code || "USER";
  const firstName = user.profile?.firstName || "";
  const lastName = user.profile?.lastName || "";
  const name = [firstName, lastName].filter(Boolean).join(" ") || user.email;

  return {
    id: user.id,
    email: user.email,
    name,
    role: primaryRole,
    emailVerified: user.emailVerified,
    isKycVerified: user.isKycVerified,
    status: user.status,
    createdAt: user.createdAt,
    profile: user.profile
      ? {
          firstName: user.profile.firstName,
          lastName: user.profile.lastName,
          avatarUrl: user.profile.avatarUrl,
        }
      : null,
  };
}

export async function createOrUpdateUserProfile(
  userId: string,
  fullName: string,
): Promise<void> {
  const parts = fullName.trim().split(" ");
  const firstName = parts[0] || fullName;
  const lastName = parts.slice(1).join(" ") || "";

  await db.profile.upsert({
    where: { userId },
    create: {
      userId,
      firstName,
      lastName,
    },
    update: {
      firstName,
      lastName,
    },
  });
}
