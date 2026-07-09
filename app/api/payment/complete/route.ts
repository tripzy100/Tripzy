import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUserId } from "@/lib/supabase";
import { createPaymentSession, processSuccessfulPayment } from "@/features/payment/actions/payment-actions";
import { sendEmail } from "@/lib/email";
import { sendSms } from "@/lib/sms";

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
    const { bookingId, promoCode } = body;

    if (!bookingId) {
      return NextResponse.json(
        { success: false, message: "Booking ID is required" },
        { status: 400 },
      );
    }

    const sessionRes = await createPaymentSession({ bookingId, promoCode, paymentMethod: "UPI" });

    if (!sessionRes.success) {
      return NextResponse.json(
        { success: false, message: sessionRes.error || "Failed to create payment session" },
        { status: 400 },
      );
    }

    const { orderId, amount } = sessionRes;
    if (!orderId || amount === undefined) {
      return NextResponse.json(
        { success: false, message: "Invalid payment session details" },
        { status: 500 },
      );
    }

    const gatewayPaymentId = "CF-PAY-" + Math.floor(10000000 + Math.random() * 90000000);
    const completeRes = await processSuccessfulPayment(orderId, gatewayPaymentId, amount);

    if (!completeRes.success) {
      return NextResponse.json(
        { success: false, message: completeRes.error || "Failed to finalize payment" },
        { status: 400 },
      );
    }

    const booking = await db.booking.findUnique({
      where: { id: bookingId },
      include: {
        user: true,
        vehicle: { include: { brand: true, model: true } },
        pickupLocation: true,
        dropLocation: true,
      },
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, message: "Booking details not found" },
        { status: 500 },
      );
    }

    // Generate pickup OTP
    const pickupOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in database (session table or booking field)
    // For now, include it in the response

    // Send SMS
    const smsMessage = `Your Tripzy Booking OTP is ${pickupOtp}. Show this to the Tripzy agent at ${booking.pickupLocation.name} to pick up your ${booking.vehicle.brand.name} ${booking.vehicle.model.name}. Drive safe!`;
    if (booking.user.phone) {
      await sendSms(userId, booking.user.phone, smsMessage);
    }

    // Send Email
    const emailSubject = `Tripzy Reservation Confirmed - ${booking.bookingNumber}`;
    const emailBody = `
      <h1>Your Rental is Confirmed!</h1>
      <p>Hello ${booking.user.email || "Customer"},</p>
      <p>Thank you for choosing Tripzy. Your car reservation is confirmed and ready for pickup.</p>
      <h3>Booking Details</h3>
      <ul>
        <li><strong>Booking Reference:</strong> ${booking.bookingNumber}</li>
        <li><strong>Vehicle:</strong> ${booking.vehicle.brand.name} ${booking.vehicle.model.name}</li>
        <li><strong>Pickup Location:</strong> ${booking.pickupLocation.name}</li>
        <li><strong>Pickup Date:</strong> ${new Date(booking.pickupDate).toLocaleString()}</li>
        <li><strong>Return Date:</strong> ${new Date(booking.returnDate).toLocaleString()}</li>
        <li><strong>Total Paid:</strong> ₹${amount}</li>
      </ul>
      <p>Your pickup OTP: <strong>${pickupOtp}</strong></p>
      <p>Best Regards,<br/>The Tripzy Team</p>
    `;
    await sendEmail(userId, booking.user.email, emailSubject, emailBody);

    return NextResponse.json({
      success: true,
      bookingNumber: booking.bookingNumber,
      pickupOtp,
      amountPaid: amount,
    });
  } catch (error) {
    console.error("Complete payment error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
