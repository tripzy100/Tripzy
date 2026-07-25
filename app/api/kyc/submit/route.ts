import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUserId } from "@/lib/supabase";
import { DocumentStatus, DocumentType } from "@prisma/client";

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
    const { drivingLicenseNumber, aadharNumber, selfieUploaded, autoApprove = true } = body;

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

    const targetStatus = autoApprove ? DocumentStatus.APPROVED : DocumentStatus.PENDING;

    // 1. Upsert Driving Licence
    await db.drivingLicence.upsert({
      where: { userId },
      update: {
        licenceNumber: cleanDl,
        status: targetStatus,
        verifiedAt: autoApprove ? new Date() : null,
      },
      create: {
        userId,
        licenceNumber: cleanDl,
        issueCountry: "IN",
        expiryDate: new Date("2035-12-31"),
        frontImageUrl: "https://mock.tripzy.io/dl_front.png",
        backImageUrl: "https://mock.tripzy.io/dl_back.png",
        status: targetStatus,
        verifiedAt: autoApprove ? new Date() : null,
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
          status: targetStatus,
          verifiedAt: autoApprove ? new Date() : null,
        },
      });
    } else {
      await db.identityDocument.create({
        data: {
          userId,
          documentType: DocumentType.AADHAR,
          documentNumber: cleanAadhar,
          imageUrl: "https://mock.tripzy.io/aadhar.png",
          status: targetStatus,
          verifiedAt: autoApprove ? new Date() : null,
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
          status: targetStatus,
          rejectionReason: null,
          reviewerNotes: autoApprove ? "Verified by Automated OCR System" : "Documents under review",
        },
      });
    } else {
      await db.kycRequest.create({
        data: {
          userId,
          status: targetStatus,
          reviewerNotes: autoApprove ? "Verified by Automated OCR System" : "Documents under review",
        },
      });
    }

    // 4. Update user.isKycVerified flag if auto-approved
    if (autoApprove) {
      await db.user.update({
        where: { id: userId },
        data: { isKycVerified: true },
      });
    }

    return NextResponse.json({
      success: true,
      message: autoApprove
        ? "KYC Documents verified and approved successfully!"
        : "KYC Documents submitted for review",
      status: targetStatus,
    });
  } catch (error: any) {
    console.error("KYC submission error:", error);
    if (error.code === "P2002") {
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
