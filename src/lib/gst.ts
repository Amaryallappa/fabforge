/** GST utilities for Indian tax compliance */

export const FABFORGE_STATE_CODE = '29'; // Karnataka (KA) - Whitefield, Bengaluru

export const STATE_CODES: Record<string, string> = {
  '27': 'Maharashtra', '07': 'Delhi', '09': 'Uttar Pradesh',
  '29': 'Karnataka', '33': 'Tamil Nadu', '36': 'Telangana',
  '19': 'West Bengal', '08': 'Rajasthan', '24': 'Gujarat',
  '03': 'Punjab', '06': 'Haryana', '23': 'Madhya Pradesh',
  '34': 'Pondicherry', '32': 'Kerala',
};

export interface GSTBreakdown {
  baseAmount: number;
  cgst?: number;
  sgst?: number;
  igst?: number;
  totalGST: number;
  totalAmount: number;
  isInterstate: boolean;
  gstRate: number;
}

export function validateGSTIN(gstin: string): boolean {
  // Format: 2 digits state code + 10 char PAN + 1 entity + Z + 1 checksum
  const regex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return regex.test(gstin.toUpperCase());
}

export function getStateFromGSTIN(gstin: string): string {
  if (!validateGSTIN(gstin)) return '';
  const code = gstin.substring(0, 2);
  return STATE_CODES[code] ?? code;
}

export function calculateGST(baseAmountInr: number, customerStateCode: string): GSTBreakdown {
  const GST_RATE = 0.18; // 18% standard rate for manufacturing services
  const isInterstate = customerStateCode !== FABFORGE_STATE_CODE;
  const totalGST = baseAmountInr * GST_RATE;

  if (isInterstate) {
    return {
      baseAmount: baseAmountInr,
      igst: totalGST,
      totalGST,
      totalAmount: baseAmountInr + totalGST,
      isInterstate: true,
      gstRate: GST_RATE,
    };
  } else {
    const halfGST = totalGST / 2;
    return {
      baseAmount: baseAmountInr,
      cgst: halfGST,
      sgst: halfGST,
      totalGST,
      totalAmount: baseAmountInr + totalGST,
      isInterstate: false,
      gstRate: GST_RATE,
    };
  }
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}
