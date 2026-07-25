import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUserId } from "@/lib/supabase";

export async function GET() {
  try {
    const userId = await getCurrentUserId();

    let user = null;
    if (userId) {
      user = await db.user.findUnique({
        where: { id: userId },
        include: {
          profile: {
            include: {
              addresses: {
                include: {
                  city: true,
                  state: true,
                  country: true,
                },
              },
            },
          },
          drivingLicence: true,
          identities: true,
          kycRequests: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
          emergencyContacts: true,
          bookings: {
            orderBy: { createdAt: "desc" },
            include: {
              vehicle: {
                include: {
                  brand: true,
                  model: true,
                },
              },
              invoices: true,
              payments: true,
            },
          },
        },
      });
    }

    // Fallback for dev / unauthenticated seed state
    if (!user) {
      user = await db.user.findFirst({
        include: {
          profile: {
            include: {
              addresses: {
                include: {
                  city: true,
                  state: true,
                  country: true,
                },
              },
            },
          },
          drivingLicence: true,
          identities: true,
          kycRequests: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
          emergencyContacts: true,
          bookings: {
            orderBy: { createdAt: "desc" },
            include: {
              vehicle: {
                include: {
                  brand: true,
                  model: true,
                },
              },
              invoices: true,
              payments: true,
            },
          },
        },
      });
    }

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User record not found. Please run seed script." },
        { status: 404 }
      );
    }

    const latestKyc = user.kycRequests[0] || null;
    const aadharDoc = user.identities.find((doc) => doc.documentType === "AADHAR") || null;
    const emergencyContact = user.emergencyContacts[0] || null;
    const primaryAddress = user.profile?.addresses[0] || null;

    // Calculate profile completion
    const profileFields = {
      fullName: !!(user.profile?.firstName && user.profile?.lastName),
      email: !!user.email,
      phone: !!user.phone,
      dateOfBirth: !!user.profile?.dateOfBirth,
      gender: !!user.profile?.gender,
      address: !!(primaryAddress?.street || primaryAddress?.zipCode),
      emergencyContact: !!(emergencyContact?.name && emergencyContact?.phone),
    };

    const completedFieldsCount = Object.values(profileFields).filter(Boolean).length;
    const totalFields = 7;
    const profileCompletionPercentage = Math.round((completedFieldsCount / totalFields) * 100);
    const isProfileComplete = completedFieldsCount === totalFields;

    // Calculate KYC status
    const dlStatus = user.drivingLicence?.status || "NOT_STARTED";
    const aadharStatus = aadharDoc?.status || "NOT_STARTED";
    const selfieStatus = latestKyc ? latestKyc.status : "NOT_STARTED";

    let overallKycStatus: "NOT_STARTED" | "PENDING" | "IN_REVIEW" | "APPROVED" | "REJECTED" = "NOT_STARTED";
    if (user.isKycVerified) {
      overallKycStatus = "APPROVED";
    } else if (latestKyc?.status === "REJECTED") {
      overallKycStatus = "REJECTED";
    } else if (latestKyc?.status === "PENDING" || latestKyc?.status === "APPROVED") {
      overallKycStatus = latestKyc.status === "APPROVED" ? "APPROVED" : "IN_REVIEW";
    } else if (dlStatus === "PENDING" || aadharStatus === "PENDING") {
      overallKycStatus = "PENDING";
    }

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone,
          isKycVerified: user.isKycVerified,
          status: user.status,
        },
        profile: user.profile
          ? {
              firstName: user.profile.firstName,
              lastName: user.profile.lastName,
              fullName: `${user.profile.firstName} ${user.profile.lastName}`.trim(),
              dateOfBirth: user.profile.dateOfBirth,
              gender: user.profile.gender,
              avatarUrl: user.profile.avatarUrl,
              address: primaryAddress
                ? `${primaryAddress.street}, ${primaryAddress.zipCode}`
                : null,
            }
          : null,
        emergencyContact: emergencyContact
          ? {
              name: emergencyContact.name,
              relationship: emergencyContact.relationship,
              phone: emergencyContact.phone,
            }
          : null,
        drivingLicence: user.drivingLicence,
        identityDocument: aadharDoc,
        kycRequest: latestKyc,
        profileFields,
        completedFieldsCount,
        totalFields,
        profileCompletionPercentage,
        isProfileComplete,
        kycProgress: {
          dlStatus,
          aadharStatus,
          selfieStatus,
          overallKycStatus,
          rejectionReason: latestKyc?.rejectionReason || null,
        },
        bookings: user.bookings,
      },
    });
  } catch (error: any) {
    console.error("Dashboard status error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load user dashboard status" },
      { status: 500 }
    );
  }
}
