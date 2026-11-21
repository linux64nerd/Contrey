/**
 * Automated Verification Suite for Contrey Security, Logic & Reliability Audit
 */

import { calculateExactEqualSplits, computeSettlements } from '../src/services/settlementEngine';
import { isValidUser } from '../src/services/storageService';
import { isValidCoordinate, calculateDistanceKm } from '../src/services/geocodingService';
import { generateUpiLink, isValidVpa } from '../src/utils/upi';
import { cleanPhoneNumber, isValidPhoneNumber, generateSettlementWhatsAppUrl } from '../src/utils/whatsapp';

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, testName: string, details?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ [PASS] ${testName}`);
  } else {
    console.error(`  ❌ [FAIL] ${testName}${details ? ` -> ${details}` : ''}`);
  }
}

console.log('\n========================================');
console.log('🚀 RUNNING CONTREY AUDIT VERIFICATION SUITE');
console.log('========================================\n');

// 1. Equal Split Exact Penny Balancing Tests
console.log('1. Financial Math: Exact Penny Balancing');
{
  const split3 = calculateExactEqualSplits(100, ['t1', 't2', 't3']);
  const sum3 = split3.reduce((acc, s) => acc + s.amount, 0);
  assert(Math.abs(sum3 - 100) < 0.0000001, '3-way split of ₹100 equals ₹100.00 with 0 drift');
  assert(split3[0].amount === 33.34 && split3[1].amount === 33.33 && split3[2].amount === 33.33, 'Penny remainder correctly allocated to first traveler');

  const split7 = calculateExactEqualSplits(1000, ['t1', 't2', 't3', 't4', 't5', 't6', 't7']);
  const sum7 = split7.reduce((acc, s) => acc + s.amount, 0);
  assert(Math.abs(sum7 - 1000) < 0.0000001, '7-way split of ₹1000 equals ₹1000.00 with 0 drift');

  const split4 = calculateExactEqualSplits(50.01, ['t1', 't2', 't3', 't4']);
  const sum4 = split4.reduce((acc, s) => acc + s.amount, 0);
  assert(Math.abs(sum4 - 50.01) < 0.0000001, '4-way split of ₹50.01 equals ₹50.01 with 0 drift');
}

// 2. Greedy Debt Engine Conservation Tests
console.log('\n2. Settlement Engine: Conservation of Funds & Greedy Minimization');
{
  const travelers = [
    { id: 't1', name: 'Rohan', phone: '+919820012345' },
    { id: 't2', name: 'Aisha', phone: '+919876543210' },
    { id: 't3', name: 'Kabir', phone: '+919123456789' },
  ];

  const expenses = [
    {
      id: 'e1',
      tripId: 'trip_1',
      title: 'Group Villa',
      amount: 100,
      currency: 'INR' as const,
      category: 'Hotels' as const,
      paidById: 't1',
      splitType: 'equal' as const,
      splits: [],
      date: new Date().toISOString(),
    },
  ];

  const result = computeSettlements('trip_1', travelers, expenses);
  const netSum = result.balances.reduce((acc, b) => acc + b.netBalance, 0);
  assert(Math.abs(netSum) < 0.001, 'Sum of all net balances equals exactly 0.00');

  const totalDebtsOwed = result.balances.filter(b => b.netBalance < 0).reduce((acc, b) => acc + (-b.netBalance), 0);
  const totalSettlementTransfers = result.settlements.reduce((acc, s) => acc + s.amount, 0);
  assert(Math.abs(totalDebtsOwed - totalSettlementTransfers) < 0.001, 'Total settlement transfers match total group debts exactly');

  // Test handling of deleted traveler
  const travelersWithDeleted = [
    { id: 't1', name: 'Rohan', phone: '+919820012345' },
    // t2 deleted from active roster
    { id: 't3', name: 'Kabir', phone: '+919123456789' },
  ];
  const resultDeleted = computeSettlements('trip_1', travelersWithDeleted, expenses);
  const netSumDeleted = resultDeleted.balances.reduce((acc, b) => acc + b.netBalance, 0);
  assert(Math.abs(netSumDeleted) < 0.001, 'Deleted traveler does not break conservation of funds');
}

// 3. Auth & Storage Schema Validation Tests
console.log('\n3. Security: User Schema & Storage Guards');
{
  assert(isValidUser({ id: 'usr_1', name: 'Alex', authMethod: 'phone' }), 'Valid user passes schema check');
  assert(!isValidUser({}), 'Empty object fails user schema check');
  assert(!isValidUser({ id: 'usr_1' }), 'User missing name fails schema check');
  assert(!isValidUser(null), 'Null fails user schema check');
  assert(!isValidUser('corrupted string'), 'String fails user schema check');
  assert(!isValidUser({ id: '', name: 'Alex', authMethod: 'email' }), 'Empty id fails user schema check');
}

// 4. UPI Deep Link & VPA Validation Tests
console.log('\n4. Financial Integrations: UPI Deep Links');
{
  assert(isValidVpa('rohan@okaxis'), 'Valid VPA is recognized');
  assert(isValidVpa('aisha.khan-1@okhdfcbank'), 'Complex valid VPA is recognized');
  assert(!isValidVpa('invalid vpa with spaces'), 'VPA with spaces rejected');
  assert(!isValidVpa(''), 'Empty VPA rejected');

  const upiLink = generateUpiLink({
    pa: 'rohan@okaxis',
    pn: 'Rohan Mehta & Co.',
    am: 1250.50,
    cu: 'INR',
    tn: 'Goa Trip = Villa Payment',
  });
  assert(upiLink.startsWith('upi://pay?'), 'UPI URL uses correct deep link scheme');
  assert(!upiLink.includes('&Co.'), 'Payee name sanitized against query parameter injection');
  assert(upiLink.includes('am=1250.50'), 'Amount formatted to exactly 2 decimals');
}

// 5. WhatsApp Deep Link & Phone Number Cleaning Tests
console.log('\n5. WhatsApp Integrations: Phone Number Cleaning & URL Resilience');
{
  assert(cleanPhoneNumber('+91 98200-12345') === '919820012345', 'Phone number cleaned to digits');
  assert(isValidPhoneNumber('+919820012345'), 'Valid phone number recognized');
  assert(!isValidPhoneNumber('123'), 'Short phone number rejected');

  const waValid = generateSettlementWhatsAppUrl('+919820012345', 'Aisha', 'Rohan', 500, '₹', 'rohan@okaxis', 'Goa Getaway');
  assert(waValid.startsWith('https://wa.me/919820012345?text='), 'Valid phone targets specific wa.me URL');

  const waInvalid = generateSettlementWhatsAppUrl('', 'Aisha', 'Rohan', 500, '₹');
  assert(waInvalid.startsWith('https://wa.me/?text='), 'Empty phone falls back gracefully to universal wa.me share URL');
}

// 6. Geocoding & Coordinate Bounds Tests
console.log('\n6. Geocoding & Map: Coordinate Bounds Validation');
{
  assert(isValidCoordinate(15.2993, 74.1240), 'Valid Goa coordinates pass');
  assert(isValidCoordinate(-8.3405, 115.0920), 'Valid Bali coordinates pass');
  assert(!isValidCoordinate(95.0, 74.1240), 'Latitude > 90 fails bounds check');
  assert(!isValidCoordinate(15.2993, 190.0), 'Longitude > 180 fails bounds check');
  assert(!isValidCoordinate(NaN, 74.1240), 'NaN coordinate fails bounds check');
  assert(!isValidCoordinate(undefined, 74.1240), 'Undefined coordinate fails bounds check');

  const dist = calculateDistanceKm(15.2993, 74.1240, 15.3050, 74.1300);
  assert(dist > 0 && isFinite(dist), 'Distance calculation returns valid positive finite number');
}

console.log('\n========================================');
console.log(`📊 SUMMARY: ${passedTests} / ${totalTests} TESTS PASSED`);
if (passedTests === totalTests) {
  console.log('🎉 ALL SECURITY, MATH & RELIABILITY TESTS PASSED WITH 100% SUCCESS!');
} else {
  console.error(`⚠️ ${totalTests - passedTests} TESTS FAILED!`);
  process.exit(1);
}
console.log('========================================\n');
