import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUserId } from "@/lib/supabase";
import { DocumentStatus, DocumentType } from "@prisma/client";

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
    const { drivingLicenseNumber, aadharNumber } = body;

    if (!drivingLicenseNumber || !aadharNumber) {
      return NextResponse.json(
        { success: false, message: "Driving License number and Aadhaar card number are required" },
        { status: 400 }
      );
    }

    const cleanDl = drivingLicenseNumber.trim().toUpperCase();
    const cleanAadhar = aadharNumber.replace(/\s+/g, "");

    if (cleanDl.length < 5) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid Driving License number" },
        { status: 400 }
      );
    }

    if (!/^\d{12}$/.test(cleanAadhar)) {
      return NextResponse.json(
        { success: false, message: "Aadhaar number must be exactly 12 digits" },
        { status: 400 }
      );
    }

    // Honest status lifecycle: KYC starts as PENDING until verified by authorized admin/process
    const initialStatus = DocumentStatus.PENDING;

    // 1. Upsert Driving Licence
    await db.drivingLicence.upsert({
      where: { userId },
      update: {
        licenceNumber: cleanDl,
        status: initialStatus,
        verifiedAt: null,
      },
      create: {
        userId,
        licenceNumber: cleanDl,
        issueCountry: "IN",
        expiryDate: new Date("2035-12-31"),
        frontImageUrl: "",
        backImageUrl: "",
        status: initialStatus,
        verifiedAt: null,
      },
    });

    // 2. Upsert Aadhaar Identity Document
    const existingAadhar = await db.identityDocument.findFirst({
      where: { userId, documentType: DocumentType.AADHAR },
    });

    if (existingAadhar) {
      await db.identityDocument.update({
        where: { id: existingAadhar.id },
        data: {
          documentNumber: cleanAadhar,
          status: initialStatus,
          verifiedAt: null,
        },
      });
    } else {
      await db.identityDocument.create({
        data: {
          userId,
          documentType: DocumentType.AADHAR,
          documentNumber: cleanAadhar,
          imageUrl: "",
          status: initialStatus,
          verifiedAt: null,
        },
      });
    }

    // 3. Upsert KycRequest
    const existingKycRequest = await db.kycRequest.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    if (existingKycRequest) {
      await db.kycRequest.update({
        where: { id: existingKycRequest.id },
        data: {
          status: initialStatus,
          rejectionReason: null,
          reviewerNotes: "Documents submitted for administrative verification queue",
        },
      });
    } else {
      await db.kycRequest.create({
        data: {
          userId,
          status: initialStatus,
          reviewerNotes: "Documents submitted for administrative verification queue",
        },
      });
    }

    // Mask sensitive Aadhaar in response
    const maskedAadhaar = `XXXX-XXXX-${cleanAadhar.slice(-4)}`;

    return NextResponse.json({
      success: true,
      message: "KYC Documents submitted successfully for verification review.",
      status: initialStatus,
      maskedAadhaar,
    });
  } catch (error: unknown) {
    console.error("KYC submission error:", error);
    if (typeof error === "object" && error !== null && "code" in error && (error as { code?: string }).code === "P2002") {
      return NextResponse.json(
        { success: false, message: "This Driving License or Aadhaar is already registered with another account." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Internal error processing KYC submission" },
      { status: 500 }
    );
  }
}
