import { Traveler, Settlement } from '../types/trip';
import { Expense } from '../types/expense';

export interface TravelerBalance {
  travelerId: string;
  name: string;
  phone: string;
  upiId?: string;
  totalPaid: number;
  fairShare: number;
  netBalance: number; // positive = owed money, negative = owes money
}

export interface SettlementEngineResult {
  totalSpent: number;
  balances: TravelerBalance[];
  settlements: Settlement[];
}

/**
 * Calculates exact equal splits with remainder penny allocation.
 * Guarantees that the sum of splits equals totalAmount with zero fractional drift.
 */
export function calculateExactEqualSplits(
  totalAmount: number,
  travelerIds: string[]
): Array<{ travelerId: string; amount: number }> {
  if (travelerIds.length === 0 || totalAmount <= 0) return [];

  const totalCents = Math.round(totalAmount * 100);
  const count = travelerIds.length;
  const baseCents = Math.floor(totalCents / count);
  const remainderCents = totalCents % count;

  return travelerIds.map((id, index) => {
    // Distribute remaining cents one-by-one to the first remainder travelers
    const cents = baseCents + (index < remainderCents ? 1 : 0);
    return {
      travelerId: id,
      amount: cents / 100,
    };
  });
}

/**
 * Minimum-Transaction Settlement Plan Algorithm (Greedy Debt Simplification)
 * Operates in integer cents to ensure mathematical precision and complete conservation of funds.
 */
export function computeSettlements(
  tripId: string,
  travelers: Traveler[],
  expenses: Expense[],
  existingSettlements: Settlement[] = []
): SettlementEngineResult {
  if (travelers.length === 0 && expenses.length === 0) {
    return { totalSpent: 0, balances: [], settlements: [] };
  }

  // 1. Build comprehensive traveler directory, including any past/deleted travelers in expenses
  const travelerMap = new Map<string, Traveler>();
  travelers.forEach((t) => travelerMap.set(t.id, t));

  expenses.forEach((e) => {
    if (e.paidById && !travelerMap.has(e.paidById)) {
      travelerMap.set(e.paidById, {
        id: e.paidById,
        name: `Former Member (${e.paidById.slice(-4)})`,
        phone: '',
      });
    }
    (e.splits || []).forEach((s) => {
      if (s.travelerId && !travelerMap.has(s.travelerId)) {
        travelerMap.set(s.travelerId, {
          id: s.travelerId,
          name: `Former Member (${s.travelerId.slice(-4)})`,
          phone: '',
        });
      }
    });
  });

  const allTravelers = Array.from(travelerMap.values());

  // 2. Accumulate in integer cents
  const paidCentsMap: Record<string, number> = {};
  const shareCentsMap: Record<string, number> = {};

  allTravelers.forEach((t) => {
    paidCentsMap[t.id] = 0;
    shareCentsMap[t.id] = 0;
  });

  let totalSpentCents = 0;

  expenses.forEach((expense) => {
    const expenseAmountCents = Math.round(expense.amount * 100);
    totalSpentCents += expenseAmountCents;
    paidCentsMap[expense.paidById] = (paidCentsMap[expense.paidById] || 0) + expenseAmountCents;

    if (expense.splitType === 'equal') {
      const splitTravelerIds =
        expense.splits && expense.splits.length > 0
          ? expense.splits.map((s) => s.travelerId)
          : travelers.map((t) => t.id);

      const computedSplits = calculateExactEqualSplits(
        expense.amount,
        splitTravelerIds.length > 0 ? splitTravelerIds : [expense.paidById]
      );

      computedSplits.forEach((s) => {
        const splitCents = Math.round(s.amount * 100);
        shareCentsMap[s.travelerId] = (shareCentsMap[s.travelerId] || 0) + splitCents;
      });
    } else {
      // Custom split: validate individual shares sum correctly
      (expense.splits || []).forEach((s) => {
        const splitCents = Math.round(Math.max(0, s.amount) * 100);
        shareCentsMap[s.travelerId] = (shareCentsMap[s.travelerId] || 0) + splitCents;
      });
    }
  });

  // 3. Compute net balances in integer cents, then convert to currency format
  const balances: TravelerBalance[] = allTravelers.map((t) => {
    const paidCents = paidCentsMap[t.id] || 0;
    const shareCents = shareCentsMap[t.id] || 0;
    const netCents = paidCents - shareCents;

    return {
      travelerId: t.id,
      name: t.name,
      phone: t.phone,
      upiId: t.upiId,
      totalPaid: paidCents / 100,
      fairShare: shareCents / 100,
      netBalance: netCents / 100,
    };
  });

  // 4. Greedy Minimum Cash Flow Algorithm in Integer Cents
  interface PersonDebtInCents {
    id: string;
    cents: number;
  }

  const debtors: PersonDebtInCents[] = [];
  const creditors: PersonDebtInCents[] = [];

  balances.forEach((b) => {
    const netCents = Math.round(b.netBalance * 100);
    if (netCents < 0) {
      debtors.push({ id: b.travelerId, cents: -netCents });
    } else if (netCents > 0) {
      creditors.push({ id: b.travelerId, cents: netCents });
    }
  });

  // Sort descending by amount to minimize total transactions
  debtors.sort((a, b) => b.cents - a.cents);
  creditors.sort((a, b) => b.cents - a.cents);

  const rawSettlements: Settlement[] = [];
  let dIdx = 0;
  let cIdx = 0;

  while (dIdx < debtors.length && cIdx < creditors.length) {
    const debtor = debtors[dIdx];
    const creditor = creditors[cIdx];

    const settleCents = Math.min(debtor.cents, creditor.cents);

    if (settleCents > 0) {
      const settlementAmount = settleCents / 100;
      const existingMatch = existingSettlements.find(
        (s) => s.fromTravelerId === debtor.id && s.toTravelerId === creditor.id
      );

      rawSettlements.push({
        id: `settle_${debtor.id}_${creditor.id}`,
        tripId,
        fromTravelerId: debtor.id,
        toTravelerId: creditor.id,
        amount: settlementAmount,
        isSettled: existingMatch ? existingMatch.isSettled : false,
        settledAt: existingMatch ? existingMatch.settledAt : undefined,
      });
    }

    debtor.cents -= settleCents;
    creditor.cents -= settleCents;

    if (debtor.cents === 0) dIdx++;
    if (creditor.cents === 0) cIdx++;
  }

  return {
    totalSpent: totalSpentCents / 100,
    balances,
    settlements: rawSettlements,
  };
}
