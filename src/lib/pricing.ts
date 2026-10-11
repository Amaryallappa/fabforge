/** FabForge India-adjusted pricing engine with CAD Geometry Integration */

export type ProcessType = 'sheet_metal' | 'cnc_machining' | '3d_printing' | 'injection_molding';

export interface CADGeometryMetadata {
  widthMm?: number;
  lengthMm?: number;
  heightMm?: number;
  cutLengthMm?: number;         // Actual laser cutting perimeter from DXF
  pierceCount?: number;         // Hole count from DXF
  volumeMm3?: number;           // Solid volume from STEP/STL
  surfaceAreaMm2?: number;      // 3D area
  calculatedWeightKg?: number;  // Real physical weight in kg
}

export interface PricingInput {
  process: ProcessType;
  material: string;
  thicknessMm: number;
  quantity: number;
  secondaryOps: string[];
  complexityFactor?: number; // 1 = simple, 1.5 = medium, 2 = complex
  cadMetadata?: CADGeometryMetadata;
}

export interface PriceResult {
  unitPrice: number;
  totalPrice: number;
  breakdownItems: { label: string; amount: number }[];
  leadTimeDays: number;
  currency: 'INR';
  physicalMetrics?: {
    weightKgPerPart: number;
    cutLengthMeters?: number;
    dimensionsMm?: string;
  };
}

// Base material rates in INR/kg (Indian market spot pricing)
export const MATERIAL_RATES_INR: Record<string, number> = {
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
  sheet_metal: 250,
  cnc_machining: 650,
  '3d_printing': 220,
  injection_molding: 15000,
};

// Secondary operations cost per part in INR
const SECONDARY_OPS_COST: Record<string, number> = {
  deburring: 0,       // included free
  bending: 150,       // per bend
  powder_coating: 85,
  anodizing: 120,
  zinc_plating: 65,
  laser_cutting: 120,
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
    cadMetadata,
  } = input;

  const matRate = MATERIAL_RATES_INR[material] ?? 160;
  const processBase = PROCESS_BASE[process] ?? 350;

  let calculatedWeightKg = 0.25;
  let machineProcessingCost = processBase * complexityFactor;
  let dimensionsStr = `${thicknessMm} mm thickness`;

  // 1. Compute Material Cost from Real CAD Geometry or Heuristics
  if (cadMetadata && cadMetadata.calculatedWeightKg && cadMetadata.calculatedWeightKg > 0) {
    calculatedWeightKg = cadMetadata.calculatedWeightKg;
    if (cadMetadata.widthMm && cadMetadata.lengthMm) {
      dimensionsStr = `${cadMetadata.widthMm} × ${cadMetadata.lengthMm} × ${cadMetadata.heightMm ?? thicknessMm} mm`;
    }
  } else {
    // Fallback: estimate from area (approx 150 x 100mm = 150cm²)
    const density = (material.includes('alu') ? 2.7 : material.includes('pla') || material.includes('nylon') ? 1.2 : 7.85);
    calculatedWeightKg = (150 * thicknessMm * density) / 10000;
  }

  const rawMaterialCost = Math.max(35, Math.round(matRate * calculatedWeightKg));

  // 2. Machine Processing Cost based on CAD geometry
  if (process === 'sheet_metal' && cadMetadata?.cutLengthMm) {
    // Real Laser cutting equation: (cut length in mm * ₹0.18/mm) + (pierces * ₹2.5) + basic handling
    const cutCost = (cadMetadata.cutLengthMm * 0.18) + ((cadMetadata.pierceCount ?? 2) * 2.5);
    machineProcessingCost = Math.round(Math.max(150, cutCost));
  } else if (process === 'cnc_machining' && cadMetadata?.volumeMm3) {
    // Real CNC milling equation: roughing volume + finishing surface area
    const stockVolume = (cadMetadata.widthMm ?? 100) * (cadMetadata.lengthMm ?? 100) * (cadMetadata.heightMm ?? 30);
    const chipsVolume = Math.max(0, stockVolume - cadMetadata.volumeMm3);
    const chipRemovalCost = (chipsVolume / 1000) * 0.8; // ₹0.8 per cm³ removed
    machineProcessingCost = Math.round(Math.max(450, chipRemovalCost + 250));
  } else if (process === '3d_printing' && cadMetadata?.volumeMm3) {
    // Real 3D printing cost: ₹12 per cm³ for SLS/FDM + support removal
    const volumeCm3 = cadMetadata.volumeMm3 / 1000;
    machineProcessingCost = Math.round(Math.max(180, volumeCm3 * 12));
  }

  // 3. Secondary Operations Cost
  const secOpsCost = secondaryOps.reduce((sum, op) => {
    return sum + (SECONDARY_OPS_COST[op] ?? 0);
  }, 0);

  // 4. Quantity Volume Discount Tiers
  let qtyDiscount = 0;
  if (quantity >= 100) qtyDiscount = 0.20;
  else if (quantity >= 50) qtyDiscount = 0.15;
  else if (quantity >= 25) qtyDiscount = 0.10;
  else if (quantity >= 10) qtyDiscount = 0.06;
  else if (quantity >= 5) qtyDiscount = 0.03;

  const baseUnit = rawMaterialCost + machineProcessingCost + secOpsCost;
  const unitPrice = Math.round(baseUnit * (1 - qtyDiscount));
  const totalPrice = Math.round(unitPrice * quantity);

  const leadTimeDays = PROCESS_LEAD_TIME[process] + (quantity > 50 ? 2 : 0);

  const breakdownItems = [
    { label: `Material (${calculatedWeightKg.toFixed(2)} kg @ ₹${matRate}/kg)`, amount: rawMaterialCost },
    { label: `${process.replace('_', ' ')} Machine Time`, amount: machineProcessingCost },
    ...(secOpsCost > 0 ? [{ label: 'Secondary Operations', amount: Math.round(secOpsCost) }] : []),
    ...(qtyDiscount > 0 ? [{ label: `Volume Discount (${(qtyDiscount * 100).toFixed(0)}%)`, amount: -Math.round(baseUnit * qtyDiscount) }] : []),
  ];

  return {
    unitPrice,
    totalPrice,
    breakdownItems,
    leadTimeDays,
    currency: 'INR',
    physicalMetrics: {
      weightKgPerPart: Number(calculatedWeightKg.toFixed(3)),
      cutLengthMeters: cadMetadata?.cutLengthMm ? Number((cadMetadata.cutLengthMm / 1000).toFixed(2)) : undefined,
      dimensionsMm: dimensionsStr,
    },
  };
}
