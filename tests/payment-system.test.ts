import { describe, it, expect } from "vitest";
import { verifyCashfreeSignature, generateCashfreeMockSignature } from "../features/payment/services/cashfree";
import { calculateTaxSplit } from "../features/payment/services/tax-compliance";

describe("Tripzy Cashfree Webhook Signatures", () => {
  it("verifies matching HMAC-SHA256 signature tokens correctly", () => {
    const orderId = "CF-ORD-123456";
    const amount = 3540;
    const status = "SUCCESS";
    const mockSignature = generateCashfreeMockSignature(orderId, amount, status);

    const isValid = verifyCashfreeSignature(orderId, amount, status, mockSignature);
    expect(isValid).toBe(true);
  });

  it("fails webhook validation check on signature token mismatches", () => {
    const orderId = "CF-ORD-123456";
    const amount = 3540;
    const status = "SUCCESS";

    const isValid = verifyCashfreeSignature(orderId, amount, status, "invalid-mock-signature-hash");
    expect(isValid).toBe(false);
  });
});

describe("Tripzy Compliance GST splits Calculations", () => {
  it("calculates separate CGST and SGST when states match", () => {
    const amount = 10000;
    // Both vehicle pickup and user profile states are Maharashtra
    const tax = calculateTaxSplit(amount, "MH", "MH");

    expect(tax.totalTax).toBe(1800); // 18% of 10000
    expect(tax.cgst).toBe(900); // 9% CGST split
    expect(tax.sgst).toBe(900); // 9% SGST split
    expect(tax.igst).toBe(0); // 0% IGST split
  });

  it("calculates IGST when states differ", () => {
    const amount = 10000;
    // Vehicle pickup is Maharashtra, but customer profile state is Delhi (DL)
    const tax = calculateTaxSplit(amount, "MH", "DL");

    expect(tax.totalTax).toBe(1800); // 18% of 10000
    expect(tax.cgst).toBe(0); // 0% CGST split
    expect(tax.sgst).toBe(0); // 0% SGST split
    expect(tax.igst).toBe(1800); // 18% IGST split
  });
});
