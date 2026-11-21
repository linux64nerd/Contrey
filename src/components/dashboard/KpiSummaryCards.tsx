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
      <div className="p-5 rounded-[12px] bg-[#ffffff] border border-[rgba(0,0,0,0.08)] flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#757575]">Total Budget</span>
          <div className="w-7 h-7 rounded-[6px] bg-[#f6f5f4] text-[#000000] flex items-center justify-center">
            <Wallet className="w-3.5 h-3.5" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold text-[#000000] tracking-tight">
            {format(convertedBudget)}
          </div>
          <span className="text-[11px] text-[#757575] mt-1 block font-normal">Trip budget target</span>
        </div>
      </div>

      {/* 2. Total Spent */}
      <div className="p-5 rounded-[12px] bg-[#ffffff] border border-[rgba(0,0,0,0.08)] flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#757575]">Total Spent</span>
          <div className="w-7 h-7 rounded-[6px] bg-[#e6f3fe] text-[#0075de] flex items-center justify-center">
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold text-[#0075de] tracking-tight">
            {format(convertedSpent)}
          </div>
          <div className="flex items-center justify-between text-xs text-[#757575] mt-1 font-normal">
            <span>{spendPercentage}% of budget</span>
            <span className={spendPercentage > 100 ? 'text-[#f64932] font-semibold' : ''}>
              {spendPercentage > 100 ? 'Exceeded' : 'On track'}
            </span>
          </div>
          <div className="w-full bg-[#f6f5f4] rounded-full h-1.5 overflow-hidden mt-2">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                spendPercentage > 90
                  ? 'bg-[#f64932]'
                  : spendPercentage > 75
                  ? 'bg-[#ffb110]'
                  : 'bg-[#0075de]'
              }`}
              style={{ width: `${Math.min(spendPercentage, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. Fair Share Per Person */}
      <div className="p-5 rounded-[12px] bg-[#ffffff] border border-[rgba(0,0,0,0.08)] flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#757575]">Share / Person</span>
          <div className="w-7 h-7 rounded-[6px] bg-[#f6f5f4] text-[#000000] flex items-center justify-center">
            <Users className="w-3.5 h-3.5" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold text-[#000000] tracking-tight">
            {format(perPersonShare)}
          </div>
          <span className="text-[11px] text-[#757575] mt-1 block font-normal">
            Equally split across {numTravelers}
          </span>
        </div>
      </div>

      {/* 4. Remaining Buffer */}
      <div className="p-5 rounded-[12px] bg-[#ffffff] border border-[rgba(0,0,0,0.08)] flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#757575]">Remaining Buffer</span>
          <div
            className={`w-7 h-7 rounded-[6px] flex items-center justify-center ${
              remainingBudget < 0 ? 'bg-[#f64932]/10 text-[#f64932]' : 'bg-[#f6f5f4] text-[#000000]'
            }`}
          >
            {remainingBudget < 0 ? (
              <AlertTriangle className="w-3.5 h-3.5 text-[#f64932]" />
            ) : (
              <DollarSign className="w-3.5 h-3.5" />
            )}
          </div>
        </div>
        <div>
          <div
            className={`text-2xl font-bold tracking-tight ${
              remainingBudget < 0 ? 'text-[#f64932]' : 'text-[#000000]'
            }`}
          >
            {format(remainingBudget)}
          </div>
          <span className="text-[11px] text-[#757575] mt-1 block font-normal">
            {remainingBudget < 0 ? 'Exceeded by ' + format(Math.abs(remainingBudget)) : 'Available for remaining trip'}
          </span>
        </div>
      </div>

      {/* 5. Settlement Progress */}
      <div className="p-5 rounded-[12px] bg-[#ffffff] border border-[rgba(0,0,0,0.08)] flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#757575]">Debts Settled</span>
          <div className="w-7 h-7 rounded-[6px] bg-[#f6f5f4] text-[#0075de] flex items-center justify-center">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold text-[#000000] tracking-tight">
            {settledCount}/{totalSettlements}
          </div>
          <span className="text-[11px] text-[#757575] mt-1 block font-normal">
            {totalSettlements === 0
              ? 'All accounts even'
              : settledCount === totalSettlements
              ? 'All debts cleared 🎉'
              : `${totalSettlements - settledCount} pending`}
          </span>
        </div>
      </div>
    </div>
  );
};
