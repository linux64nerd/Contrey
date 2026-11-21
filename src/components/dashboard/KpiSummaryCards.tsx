import React from 'react';
import { useCurrency } from '../../context/CurrencyContext';
import { CurrencyCode } from '../../types/currency';
import { Wallet, Users, ArrowUpRight, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

interface KpiSummaryCardsProps {
  totalBudget: number;
  totalSpent: number;
  numTravelers: number;
  baseCurrency: CurrencyCode;
  totalSettlements: number;
  settledCount: number;
}

export const KpiSummaryCards: React.FC<KpiSummaryCardsProps> = ({
  totalBudget,
  totalSpent,
  numTravelers,
  baseCurrency,
  totalSettlements,
  settledCount,
}) => {
  const { currentCurrency, format, convertAmount } = useCurrency();

  const convertedBudget = convertAmount(totalBudget, baseCurrency, currentCurrency);
  const convertedSpent = convertAmount(totalSpent, baseCurrency, currentCurrency);
  const remainingBudget = convertedBudget - convertedSpent;
  const perPersonShare = numTravelers > 0 ? convertedSpent / numTravelers : 0;
  const spendPercentage = convertedBudget > 0 ? Math.round((convertedSpent / convertedBudget) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* 1. Total Budget */}
      <div className="contrey-card p-5 flex flex-col justify-between dark:bg-slate-900 dark:border-slate-800 hover-lift animate-fade-in-up stagger-1 group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">
            Total Budget
          </span>
          <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/60 group-hover:text-indigo-600 transition-all duration-300">
            <Wallet className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight font-heading group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {format(convertedBudget)}
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block font-medium">
            Allocated trip cap
          </span>
        </div>
      </div>

      {/* 2. Total Spent */}
      <div className="contrey-card p-5 flex flex-col justify-between dark:bg-slate-900 dark:border-slate-800 hover-lift animate-fade-in-up stagger-2 group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">
            Total Spent
          </span>
          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight font-heading">
            {format(convertedSpent)}
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            <span>{spendPercentage}% of target</span>
            <span className={spendPercentage > 100 ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-slate-600 dark:text-slate-400'}>
              {spendPercentage > 100 ? 'Over Budget' : 'On Track'}
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden mt-2.5">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                spendPercentage > 90
                  ? 'bg-rose-500'
                  : spendPercentage > 75
                  ? 'bg-amber-500'
                  : 'bg-indigo-600'
              }`}
              style={{ width: `${Math.min(spendPercentage, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. Fair Share Per Person */}
      <div className="contrey-card p-5 flex flex-col justify-between dark:bg-slate-900 dark:border-slate-800 hover-lift animate-fade-in-up stagger-3 group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">
            Share / Person
          </span>
          <div className="w-8 h-8 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-violet-100 dark:group-hover:bg-violet-900/60 transition-all duration-300">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight font-heading group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {format(perPersonShare)}
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block font-medium">
            Across {numTravelers} crew members
          </span>
        </div>
      </div>

      {/* 4. Remaining Buffer */}
      <div className="contrey-card p-5 flex flex-col justify-between dark:bg-slate-900 dark:border-slate-800 hover-lift animate-fade-in-up stagger-4 group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">
            Remaining Buffer
          </span>
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${
              remainingBudget >= 0
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
            }`}
          >
            {remainingBudget >= 0 ? (
              <ShieldCheck className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
          </div>
        </div>
        <div>
          <div
            className={`text-2xl font-extrabold tracking-tight font-heading ${
              remainingBudget >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {format(remainingBudget)}
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block font-medium">
            {remainingBudget >= 0 ? 'Safe unspent liquidity' : 'Budget exceeded'}
          </span>
        </div>
      </div>

      {/* 5. Settlement Debt Resolution */}
      <div className="contrey-card p-5 flex flex-col justify-between dark:bg-slate-900 dark:border-slate-800 hover-lift animate-fade-in-up stagger-5 group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">
            Settlement Progress
          </span>
          <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight font-heading group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {settledCount} / {totalSettlements}
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block font-medium">
            {totalSettlements === 0
              ? 'Zero pending debts'
              : settledCount === totalSettlements
              ? '🎉 100% Fully settled!'
              : `${totalSettlements - settledCount} transfers pending`}
          </span>
        </div>
      </div>
    </div>
  );
};
