/** FabForge India-adjusted pricing engine */

export type ProcessType = 'sheet_metal' | 'cnc_machining' | '3d_printing' | 'injection_molding';

export interface PricingInput {
  process: ProcessType;
  material: string;
  thicknessMm: number;
  quantity: number;
  secondaryOps: string[];
  complexityFactor?: number; // 1 = simple, 1.5 = medium, 2 = complex
}

export interface PriceResult {
  unitPrice: number;
  totalPrice: number;
  breakdownItems: { label: string; amount: number }[];
  leadTimeDays: number;
  currency: 'INR';
}

// Base material rates in INR/kg (Indian market pricing)
const MATERIAL_RATES_INR: Record<string, number> = {
  'stainless-304': 260,
  'stainless-316': 340,
  'cr-steel': 72,
  'ar400': 120,
  'alu-6061': 310,
  'alu-7075': 420,
  'copper': 880,
  'brass': 650,
  'pla': 180,
  'abs': 220,
  'pc': 280,
  'nylon-pa12': 380,
};

// Process base cost in INR
const PROCESS_BASE: Record<ProcessType, number> = {
  sheet_metal: 350,
  cnc_machining: 800,
  '3d_printing': 250,
  injection_molding: 15000, // tooling amortized
};

// Secondary operations cost per part in INR
const SECONDARY_OPS_COST: Record<string, number> = {
  deburring: 0,       // included
  bending: 150,       // per bend
  powder_coating: 85,
  anodizing: 120,
  zinc_plating: 65,
  laser_cutting: 200,
  tapping: 45,        // per hole
  welding: 350,
};

// Lead time by process in business days
const PROCESS_LEAD_TIME: Record<ProcessType, number> = {
  sheet_metal: 3,
  cnc_machining: 5,
  '3d_printing': 2,
  injection_molding: 14,
};

export function calculatePrice(input: PricingInput): PriceResult {
  const {
    process,
    material,
    thicknessMm,
    quantity,
    secondaryOps,
    complexityFactor = 1,
  } = input;

  const matRate = MATERIAL_RATES_INR[material] ?? 150;
  const processBase = PROCESS_BASE[process] ?? 400;

  // Estimate part weight from thickness (rough: 200cm² area, density approx)
  const estimatedWeightKg = (200 * thicknessMm * 7.8) / 1000000; // cm² * mm * density_g/cm³ / 1e6
  const materialCost = Math.max(30, matRate * estimatedWeightKg * 100);

  // Machine + labor cost
  const machineCost = processBase * complexityFactor;

  // Secondary operations
  const secOpsCost = secondaryOps.reduce((sum, op) => {
    return sum + (SECONDARY_OPS_COST[op] ?? 0);
  }, 0);

  // Quantity discount
  let qtyDiscount = 0;
  if (quantity >= 50) qtyDiscount = 0.15;
  else if (quantity >= 10) qtyDiscount = 0.08;
  else if (quantity >= 5) qtyDiscount = 0.04;

  const baseUnit = materialCost + machineCost + secOpsCost;
  const unitPrice = Math.round(baseUnit * (1 - qtyDiscount));
  const totalPrice = Math.round(unitPrice * quantity);

  const leadTimeDays = PROCESS_LEAD_TIME[process] + (quantity > 50 ? 2 : 0);

  const breakdownItems = [
    { label: 'Material Cost', amount: Math.round(materialCost) },
    { label: `${process.replace('_', ' ')} Processing`, amount: Math.round(machineCost) },
    ...(secOpsCost > 0 ? [{ label: 'Secondary Operations', amount: Math.round(secOpsCost) }] : []),
    ...(qtyDiscount > 0 ? [{ label: `Volume Discount (${(qtyDiscount * 100).toFixed(0)}%)`, amount: -Math.round(baseUnit * qtyDiscount) }] : []),
  ];

  return { unitPrice, totalPrice, breakdownItems, leadTimeDays, currency: 'INR' };
}
