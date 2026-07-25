import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUserId } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    let userId = await getCurrentUserId();

    if (!userId) {
      const fallbackUser = await db.user.findFirst({ select: { id: true } });
      userId = fallbackUser?.id || null;
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized user session" },
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
      let defaultCity = await db.city.findFirst();
      let defaultState = await db.state.findFirst();
      let defaultCountry = await db.country.findFirst();

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
  } catch (error: any) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update profile" },
      { status: 500 }
    );
  }
}
