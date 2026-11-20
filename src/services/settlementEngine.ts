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
 * Minimum-Transaction Settlement Plan Algorithm (Greedy Debt Simplification)
 * Calculates the exact minimal cash transfers to settle all group debts cleanly.
 */
export function computeSettlements(
  tripId: string,
  travelers: Traveler[],
  expenses: Expense[],
  existingSettlements: Settlement[] = []
): SettlementEngineResult {
  if (travelers.length === 0) {
    return { totalSpent: 0, balances: [], settlements: [] };
  }

  // 1. Initialize balance maps
  const paidMap: Record<string, number> = {};
  const shareMap: Record<string, number> = {};

  travelers.forEach((t) => {
    paidMap[t.id] = 0;
    shareMap[t.id] = 0;
  });

  let totalSpent = 0;

  // 2. Accumulate paid amounts and individual shares
  expenses.forEach((expense) => {
    totalSpent += expense.amount;
    paidMap[expense.paidById] = (paidMap[expense.paidById] || 0) + expense.amount;

    if (expense.splitType === 'equal') {
      const splitCount = expense.splits && expense.splits.length > 0
        ? expense.splits.length
        : travelers.length;
      const perPerson = expense.amount / splitCount;

      if (expense.splits && expense.splits.length > 0) {
        expense.splits.forEach((s) => {
          shareMap[s.travelerId] = (shareMap[s.travelerId] || 0) + s.amount;
        });
      } else {
        travelers.forEach((t) => {
          shareMap[t.id] = (shareMap[t.id] || 0) + perPerson;
        });
      }
    } else {
      // Custom split
      expense.splits.forEach((s) => {
        shareMap[s.travelerId] = (shareMap[s.travelerId] || 0) + s.amount;
      });
    }
  });

  // 3. Compute net balances
  const balances: TravelerBalance[] = travelers.map((t) => {
    const totalPaid = Math.round((paidMap[t.id] || 0) * 100) / 100;
    const fairShare = Math.round((shareMap[t.id] || 0) * 100) / 100;
    const netBalance = Math.round((totalPaid - fairShare) * 100) / 100;

    return {
      travelerId: t.id,
      name: t.name,
      phone: t.phone,
      upiId: t.upiId,
      totalPaid,
      fairShare,
      netBalance,
    };
  });

  // 4. Greedy Minimum Cash Flow Algorithm
  // Separate into debtors (netBalance < 0) and creditors (netBalance > 0)
  interface PersonDebt {
    id: string;
    amount: number;
  }

  const debtors: PersonDebt[] = [];
  const creditors: PersonDebt[] = [];

  balances.forEach((b) => {
    if (b.netBalance < -0.01) {
      debtors.push({ id: b.travelerId, amount: -b.netBalance });
    } else if (b.netBalance > 0.01) {
      creditors.push({ id: b.travelerId, amount: b.netBalance });
    }
  });

  // Sort descending by amount to minimize transaction count
  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  const rawSettlements: Settlement[] = [];
  let dIdx = 0;
  let cIdx = 0;

  while (dIdx < debtors.length && cIdx < creditors.length) {
    const debtor = debtors[dIdx];
    const creditor = creditors[cIdx];

    const settleAmount = Math.min(debtor.amount, creditor.amount);
    const roundedAmount = Math.round(settleAmount * 100) / 100;

    if (roundedAmount > 0.01) {
      const existingMatch = existingSettlements.find(
        (s) => s.fromTravelerId === debtor.id && s.toTravelerId === creditor.id
      );

      rawSettlements.push({
        id: `settle_${debtor.id}_${creditor.id}`,
        tripId,
        fromTravelerId: debtor.id,
        toTravelerId: creditor.id,
        amount: roundedAmount,
        isSettled: existingMatch ? existingMatch.isSettled : false,
        settledAt: existingMatch ? existingMatch.settledAt : undefined,
      });
    }

    debtor.amount -= settleAmount;
    creditor.amount -= settleAmount;

    if (debtor.amount <= 0.01) dIdx++;
    if (creditor.amount <= 0.01) cIdx++;
  }

  return {
    totalSpent,
    balances,
    settlements: rawSettlements,
  };
}
