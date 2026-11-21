import { Trip, AlertSeverity } from '../types/trip';
import { Expense } from '../types/expense';

export interface UrgencyAnalysis {
  hasCriticalAlert: boolean;
  hasWarningAlert: boolean;
  alerts: Array<{
    title: string;
    message: string;
    severity: AlertSeverity;
    category?: string;
  }>;
  categoryPercentages: Record<string, number>;
  remainingPercentage: number;
}

/**
 * Analyzes trip budget against expenses and identifies urgency triggers.
 *
 * Alert Threshold Specifications:
 * - Single Heavy Expense: >= 40% of the entire trip budget in a single line item
 * - High Category Spend: >= 40% of the entire trip budget concentrated in one category (e.g. Hotels)
 * - Budget Cap Exhaustion: Total spent exceeds 100% of the allocated budget
 * - Critical Budget Threshold: Remaining funds <= 20% of target budget (prompts austerity guidance)
 * - Budget Caution: Remaining funds <= 35% of target budget
 *
 * @param trip - Current active trip metadata including totalBudget and baseCurrency
 * @param expenses - List of recorded trip expenses
 * @returns UrgencyAnalysis containing active alerts, category percentages, and critical flags
 */
export function evaluateTripUrgency(trip: Trip, expenses: Expense[]): UrgencyAnalysis {
  const alerts: UrgencyAnalysis['alerts'] = [];
  const totalBudget = trip.totalBudget;

  if (totalBudget <= 0) {
    return {
      hasCriticalAlert: false,
      hasWarningAlert: false,
      alerts: [],
      categoryPercentages: {},
      remainingPercentage: 100,
    };
  }

  // 1. Calculate category spends and total spend
  const categorySpends: Record<string, number> = {
    Hotels: 0,
    Food: 0,
    Transportation: 0,
    Shopping: 0,
    Activities: 0,
  };

  let totalSpent = 0;

  expenses.forEach((e) => {
    totalSpent += e.amount;
    categorySpends[e.category] = (categorySpends[e.category] || 0) + e.amount;

    // Check Single Heavy Item Spend (>= 40% of total budget)
    const singleItemPercent = Math.round((e.amount / totalBudget) * 100);
    if (singleItemPercent >= 40) {
      alerts.push({
        title: `Heavy Expense Alert: "${e.title}"`,
        message: `This single expense took ${singleItemPercent}% of your entire trip budget! Re-balance remaining expenses accordingly.`,
        severity: 'urgent',
        category: e.category,
      });
    }
  });

  // 2. Check Category-Level Spend (>= 40% of total budget)
  const categoryPercentages: Record<string, number> = {};
  Object.entries(categorySpends).forEach(([cat, amount]) => {
    const pct = Math.round((amount / totalBudget) * 100);
    categoryPercentages[cat] = pct;

    if (pct >= 40) {
      alerts.push({
        title: `High ${cat} Spend (${pct}% of Budget)`,
        message: `Urgency Alert: ${pct}% of your total trip budget was spent on ${cat}. Plan remaining days carefully!`,
        severity: 'urgent',
        category: cat,
      });
    }
  });

  // 3. Check Remaining Budget Level
  const remainingBudget = totalBudget - totalSpent;
  const remainingPercentage = Math.round((remainingBudget / totalBudget) * 100);

  if (totalSpent > totalBudget) {
    alerts.push({
      title: '🚨 Trip Budget Exceeded!',
      message: `You have spent ${Math.round((totalSpent / totalBudget) * 100)}% of your target budget. Any further spend will increase debt.`,
      severity: 'urgent',
    });
  } else if (remainingPercentage <= 20) {
    alerts.push({
      title: '⚠️ Critical Remaining Budget (≤ 20%)',
      message: `Remaining funds are at ${remainingPercentage}%. Remaining money must be spent STRICTLY on essentials (food, return transport, emergency buffer)!`,
      severity: 'urgent',
    });
  } else if (remainingPercentage <= 35) {
    alerts.push({
      title: 'Budget Caution (≤ 35% Remaining)',
      message: `You have consumed ${(100 - remainingPercentage)}% of your planned budget. Review upcoming luxury spends.`,
      severity: 'warning',
    });
  }

  return {
    hasCriticalAlert: alerts.some((a) => a.severity === 'urgent'),
    hasWarningAlert: alerts.some((a) => a.severity === 'warning'),
    alerts,
    categoryPercentages,
    remainingPercentage,
  };
}

/**
 * Triggers native Web Push Notification if permission is granted
 */
export function sendBrowserPushNotification(title: string, body: string): boolean {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: 'https://api.iconify.design/lucide:plane.svg?color=%23059669',
      });
      return true;
    } catch (e) {
      console.warn('Native notification dispatch failed', e);
      return false;
    }
  }

  return false;
}
