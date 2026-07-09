import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUserId } from "@/lib/supabase";
import { DocumentStatus, DocumentType } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { aadharNumber, drivingLicenseNumber } = body;

    if (!aadharNumber || !drivingLicenseNumber) {
      return NextResponse.json(
        { success: false, message: "Aadhar and Driving License numbers are required" },
        { status: 400 },
      );
    }

    const cleanAadhar = aadharNumber.replace(/\s+/g, "");
    if (!/^\d{12}$/.test(cleanAadhar)) {
      return NextResponse.json(
        { success: false, message: "Invalid Aadhar card number. Must be 12 digits." },
        { status: 400 },
      );
    }

    const cleanDl = drivingLicenseNumber.trim().toUpperCase();
    if (cleanDl.length < 5) {
      return NextResponse.json(
        { success: false, message: "Invalid Driving License number." },
        { status: 400 },
      );
    }

    // 1. Upsert Identity Document (Aadhar)
    const existingAadhar = await db.identityDocument.findFirst({
      where: { userId, documentType: DocumentType.AADHAR },
    });

    if (existingAadhar) {
      await db.identityDocument.update({
        where: { id: existingAadhar.id },
        data: { documentNumber: cleanAadhar, status: DocumentStatus.APPROVED, verifiedAt: new Date() },
      });
    } else {
      await db.identityDocument.create({
        data: {
          userId,
          documentType: DocumentType.AADHAR,
          documentNumber: cleanAadhar,
          imageUrl: "https://mock.tripzy.io/aadhar.png",
          status: DocumentStatus.APPROVED,
          verifiedAt: new Date(),
        },
      });
    }

    // 2. Upsert Driving License
    await db.drivingLicence.upsert({
      where: { userId },
      update: { licenceNumber: cleanDl, status: DocumentStatus.APPROVED, verifiedAt: new Date() },
      create: {
        userId,
        licenceNumber: cleanDl,
        issueCountry: "IN",
        expiryDate: new Date("2035-12-31"),
        frontImageUrl: "https://mock.tripzy.io/dl_front.png",
        backImageUrl: "https://mock.tripzy.io/dl_back.png",
        status: DocumentStatus.APPROVED,
        verifiedAt: new Date(),
      },
    });

    // 3. Update user KYC status
    await db.user.update({
      where: { id: userId },
      data: { isKycVerified: true },
    });

    return NextResponse.json({
      success: true,
      message: "KYC documents verified successfully",
    });
  } catch (error: any) {
    console.error("KYC verification error:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { success: false, message: "This Aadhar or Driving License is already verified by another user." },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { success: false, message: "Internal server error during verification" },
      { status: 500 },
    );
  }
}
