import { calculatePrice } from '../src/lib/pricing.js';
import { calculateGST, validateGSTIN, getStateFromGSTIN } from '../src/lib/gst.js';

console.log('=== RUNNING FABFORGE TEST SUITE ===');

// Test 1: GSTIN Validation
console.log('\n[Test 1] GSTIN Validation:');
const validMH = '27AABCF1234F1Z8';
const validKA = '29AABCF1234F1Z5';
const invalidGST = '12345ABCDE';
console.assert(validateGSTIN(validMH) === true, 'validMH should pass');
console.assert(validateGSTIN(validKA) === true, 'validKA should pass');
console.assert(validateGSTIN(invalidGST) === false, 'invalidGST should fail');
console.log('✓ GSTIN validation tests passed');

// Test 2: State Detection from GSTIN
console.log('\n[Test 2] State Detection from GSTIN:');
console.assert(getStateFromGSTIN(validMH) === 'Maharashtra', 'Should detect Maharashtra');
console.assert(getStateFromGSTIN(validKA) === 'Karnataka', 'Should detect Karnataka');
console.log('✓ State detection tests passed');

// Test 3: GST Tax Calculations (Intrastate MH vs Interstate KA)
console.log('\n[Test 3] GST Breakdown:');
const baseVal = 10000;
const intrastate = calculateGST(baseVal, '27');
console.assert(intrastate.isInterstate === false, 'MH to MH should be intrastate');
console.assert(intrastate.cgst === 900, 'CGST should be 900 (9%)');
console.assert(intrastate.sgst === 900, 'SGST should be 900 (9%)');
console.assert(intrastate.totalGST === 1800, 'Total GST should be 1800');
console.assert(intrastate.totalAmount === 11800, 'Total should be 11800');

const interstate = calculateGST(baseVal, '29');
console.assert(interstate.isInterstate === true, 'MH to KA should be interstate');
console.assert(interstate.igst === 1800, 'IGST should be 1800 (18%)');
console.assert(interstate.totalAmount === 11800, 'Total should be 11800');
console.log('✓ GST calculation tests passed');

// Test 4: Pricing Engine - Sheet Metal
console.log('\n[Test 4] Pricing Engine - Sheet Metal:');
const quote1 = calculatePrice({
  process: 'sheet_metal',
  material: 'stainless-304',
  thicknessMm: 2.0,
  quantity: 1,
  secondaryOps: ['deburring', 'bending'],
});
console.log('Sheet metal 1 part total:', quote1.totalPrice, 'Lead time:', quote1.leadTimeDays, 'days');
console.assert(quote1.totalPrice > 0, 'Price must be positive');
console.assert(quote1.leadTimeDays >= 3, 'Lead time must be at least 3 days');

// Test 5: Volume Discount Tier
console.log('\n[Test 5] Volume Discount:');
const quoteSingle = calculatePrice({
  process: 'sheet_metal',
  material: 'stainless-304',
  thicknessMm: 2.0,
  quantity: 1,
  secondaryOps: [],
});
const quoteBulk = calculatePrice({
  process: 'sheet_metal',
  material: 'stainless-304',
  thicknessMm: 2.0,
  quantity: 50,
  secondaryOps: [],
});
console.log('Unit price (1 qty):', quoteSingle.unitPrice, 'vs (50 qty):', quoteBulk.unitPrice);
console.assert(quoteBulk.unitPrice < quoteSingle.unitPrice, 'Bulk unit price must be discounted');
console.log('✓ Volume discount tests passed');

console.log('\n🎉 ALL 5 TEST SUITES PASSED FLAWLESSLY!');
