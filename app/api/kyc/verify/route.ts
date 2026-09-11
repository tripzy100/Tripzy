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
        { status: 401 },
      );
    }

    const body = await request.json();
    const { aadharNumber, drivingLicenseNumber } = body;

    if (!aadharNumber || !drivingLicenseNumber) {
      return NextResponse.json(
        { success: false, message: "Aadhaar and Driving License numbers are required" },
        { status: 400 },
      );
    }

    const cleanAadhar = aadharNumber.replace(/\s+/g, "");
    if (!/^\d{12}$/.test(cleanAadhar)) {
      return NextResponse.json(
        { success: false, message: "Invalid Aadhaar card number. Must be 12 digits." },
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

    // Honest status model: Document verification status is PENDING upon submission
    const targetStatus = DocumentStatus.PENDING;

    // 1. Upsert Identity Document (Aadhaar)
    const existingAadhar = await db.identityDocument.findFirst({
      where: { userId, documentType: DocumentType.AADHAR },
    });

    if (existingAadhar) {
      await db.identityDocument.update({
        where: { id: existingAadhar.id },
        data: { documentNumber: cleanAadhar, status: targetStatus, verifiedAt: null },
      });
    } else {
      await db.identityDocument.create({
        data: {
          userId,
          documentType: DocumentType.AADHAR,
          documentNumber: cleanAadhar,
          imageUrl: "",
          status: targetStatus,
          verifiedAt: null,
        },
      });
    }

    // 2. Upsert Driving License
    await db.drivingLicence.upsert({
      where: { userId },
      update: { licenceNumber: cleanDl, status: targetStatus, verifiedAt: null },
      create: {
        userId,
        licenceNumber: cleanDl,
        issueCountry: "IN",
        expiryDate: new Date("2035-12-31"),
        frontImageUrl: "",
        backImageUrl: "",
        status: targetStatus,
        verifiedAt: null,
      },
    });

    // 3. Upsert KycRequest
    const existingKyc = await db.kycRequest.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    if (existingKyc) {
      await db.kycRequest.update({
        where: { id: existingKyc.id },
        data: { status: targetStatus, reviewerNotes: "Submitted for manual verification review" },
      });
    } else {
      await db.kycRequest.create({
        data: {
          userId,
          status: targetStatus,
          reviewerNotes: "Submitted for manual verification review",
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "KYC document details submitted for verification review.",
      status: targetStatus,
    });
  } catch (error: any) {
    console.error("KYC verification error:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { success: false, message: "This Aadhaar or Driving License is already registered under another account." },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { success: false, message: "Internal server error during verification processing" },
      { status: 500 },
    );
  }
}
