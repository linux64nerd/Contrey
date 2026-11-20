import React from 'react';
import { useCurrency } from '../../context/CurrencyContext';
import { DollarSign, Wallet, Users, ArrowUpRight, CheckCircle2, AlertTriangle } from 'lucide-react';

interface KpiSummaryCardsProps {
  totalBudget: number;
  totalSpent: number;
  numTravelers: number;
  baseCurrency: string;
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

  const convertedBudget = convertAmount(totalBudget, baseCurrency as any, currentCurrency);
  const convertedSpent = convertAmount(totalSpent, baseCurrency as any, currentCurrency);
  const remainingBudget = convertedBudget - convertedSpent;
  const perPersonShare = numTravelers > 0 ? convertedSpent / numTravelers : 0;
  const spendPercentage = convertedBudget > 0 ? Math.round((convertedSpent / convertedBudget) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* 1. Total Budget */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold">Total Budget</span>
          <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <Wallet className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-black text-slate-900">{format(convertedBudget)}</div>
          <span className="text-[11px] text-slate-400 font-medium">Trip Target Limit</span>
        </div>
      </div>

      {/* 2. Total Spent */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold">Total Spent</span>
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-black text-emerald-700">{format(convertedSpent)}</div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1 font-medium">
            <span>{spendPercentage}% of Budget</span>
            <span className={spendPercentage > 100 ? 'text-rose-600 font-bold' : ''}>
              {spendPercentage > 100 ? 'Exceeded' : 'On Track'}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mt-2">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                spendPercentage > 90
                  ? 'bg-rose-500'
                  : spendPercentage > 75
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(spendPercentage, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. Fair Share Per Person */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold">Fair Share / Person</span>
          <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-black text-teal-800">{format(perPersonShare)}</div>
          <span className="text-[11px] text-slate-400 font-medium">
            Equally split across {numTravelers} travelers
          </span>
        </div>
      </div>

      {/* 4. Remaining Budget */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold">Remaining Buffer</span>
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              remainingBudget < 0 ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-700'
            }`}
          >
            {remainingBudget < 0 ? (
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            ) : (
              <DollarSign className="w-4 h-4" />
            )}
          </div>
        </div>
        <div>
          <div
            className={`text-2xl font-black ${
              remainingBudget < 0 ? 'text-rose-600' : 'text-slate-900'
            }`}
          >
            {format(remainingBudget)}
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            {remainingBudget < 0 ? 'Over budget by ' + format(Math.abs(remainingBudget)) : 'Available for remaining trip'}
          </span>
        </div>
      </div>

      {/* 5. Settlement Progress */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold">Settlement Progress</span>
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-black text-slate-900">
            {settledCount}/{totalSettlements}
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            {totalSettlements === 0
              ? 'All accounts settled'
              : settledCount === totalSettlements
              ? 'All debts paid in full 🎉'
              : `${totalSettlements - settledCount} payments pending`}
          </span>
        </div>
      </div>
    </div>
  );
};
