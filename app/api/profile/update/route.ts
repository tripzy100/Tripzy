import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUserId } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      firstName,
      lastName,
      phone,
      dateOfBirth,
      gender,
      street,
      zipCode,
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelationship,
    } = body;

    // 1. Update user phone number if provided
    if (phone) {
      await db.user.update({
        where: { id: userId },
        data: { phone },
      });
    }

    // 2. Upsert profile
    const existingProfile = await db.profile.findUnique({
      where: { userId },
    });

    let profileId = existingProfile?.id;

    if (existingProfile) {
      await db.profile.update({
        where: { id: existingProfile.id },
        data: {
          firstName: firstName ?? existingProfile.firstName,
          lastName: lastName ?? existingProfile.lastName,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : existingProfile.dateOfBirth,
          gender: gender ?? existingProfile.gender,
        },
      });
    } else {
      const newProfile = await db.profile.create({
        data: {
          userId,
          firstName: firstName || "Customer",
          lastName: lastName || "User",
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
          gender: gender || null,
        },
      });
      profileId = newProfile.id;
    }

    // 3. Upsert address if street or zip code provided
    if (profileId && (street || zipCode)) {
      const existingAddress = await db.address.findFirst({
        where: { profileId },
      });

      // Get default city, state, country if needed
      const defaultCity = await db.city.findFirst();
      const defaultState = await db.state.findFirst();
      const defaultCountry = await db.country.findFirst();

      if (existingAddress) {
        await db.address.update({
          where: { id: existingAddress.id },
          data: {
            street: street || existingAddress.street,
            zipCode: zipCode || existingAddress.zipCode,
          },
        });
      } else if (defaultCity && defaultState && defaultCountry) {
        await db.address.create({
          data: {
            profileId,
            street: street || "Main Street",
            zipCode: zipCode || "110001",
            cityId: defaultCity.id,
            stateId: defaultState.id,
            countryId: defaultCountry.id,
            isDefault: true,
          },
        });
      }
    }

    // 4. Upsert Emergency Contact if provided
    if (emergencyContactName && emergencyContactPhone) {
      const existingEC = await db.emergencyContact.findFirst({
        where: { userId },
      });

      if (existingEC) {
        await db.emergencyContact.update({
          where: { id: existingEC.id },
          data: {
            name: emergencyContactName,
            phone: emergencyContactPhone,
            relationship: emergencyContactRelationship || "Family",
          },
        });
      } else {
        await db.emergencyContact.create({
          data: {
            userId,
            name: emergencyContactName,
            phone: emergencyContactPhone,
            relationship: emergencyContactRelationship || "Family",
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error: unknown) {
    console.error("Profile update error:", error);
    const msg = error instanceof Error ? error.message : "Failed to update profile";
    return NextResponse.json(
      { success: false, message: msg },
      { status: 500 }
    );
  }
}
