export interface TaxSplit {
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
}

/**
 * Calculates separate CGST, SGST, and IGST components.
 * If rental pickup state matches customer state, applies CGST (9%) + SGST (9%),
 * otherwise applies IGST (18%).
 */
export function calculateTaxSplit(
  amount: number,
  pickupState: string,
  customerState: string,
): TaxSplit {
  const taxRate = 0.18;
  const totalTax = Math.round(amount * taxRate);

  if (pickupState.toLowerCase() === customerState.toLowerCase()) {
    const split = Math.round(totalTax / 2);
    return {
      cgst: split,
      sgst: split,
      igst: 0,
      totalTax,
    };
  }

  return {
    cgst: 0,
    sgst: 0,
    igst: totalTax,
    totalTax,
  };
}

/**
 * Generates Credit Note metadata parameters for processed refunds.
 */
export function generateCreditNote(invoiceNumber: string, refundAmount: number, reason: string) {
  return {
    creditNoteNumber: `CN-${Date.now().toString().slice(-6)}-${invoiceNumber}`,
    originalInvoice: invoiceNumber,
    refundedAmount: refundAmount,
    taxAdjustment: Math.round(refundAmount * 0.18),
    reason,
    issuedAt: new Date(),
  };
}
