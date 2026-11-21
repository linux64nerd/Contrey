import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

export const InteractivePreviewCard: React.FC = () => {
  const { currentCurrency, format, convertAmount } = useCurrency();

  const [totalBudgetEUR, setTotalBudgetEUR] = useState<number>(1200);
  const [numTravelers, setNumTravelers] = useState<number>(4);
  const [spentPercent, setSpentPercent] = useState<number>(65);

  const totalBudget = convertAmount(totalBudgetEUR, 'EUR', currentCurrency);
  const totalSpent = (totalBudget * spentPercent) / 100;
  const perPersonShare = totalSpent / numTravelers;
  const remainingBudget = totalBudget - totalSpent;

  return (
    <div className="rounded-[12px] bg-[#ffffff] p-6 sm:p-8 border border-[rgba(0,0,0,0.08)] shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all">
      {/* Notion Page-style Window Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[rgba(0,0,0,0.08)] gap-3">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">🏖️</span>
          <div>
            <h3 className="text-lg font-bold text-[#000000] tracking-tight">
              Goa Beach Trip 2026
            </h3>
            <p className="text-xs text-[#757575] font-normal">
              Contrey Interactive Expense Ledger
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f6f5f4] text-xs font-medium text-[#615d59] border border-[rgba(0,0,0,0.08)]">
          <RefreshCw className="w-3.5 h-3.5 text-[#0075de]" />
          <span>Real-time FX: {currentCurrency}</span>
        </div>
      </div>

      {/* Sliders Container (Clean white surface with 1px border) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-[rgba(0,0,0,0.08)]">
        {/* Slider 1: Total Trip Target */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-[#757575] font-medium">Trip Budget</span>
            <span className="font-bold text-[#000000]">{format(totalBudget)}</span>
          </div>
          <input
            type="range"
            min="400"
            max="5000"
            step="100"
            value={totalBudgetEUR}
            onChange={(e) => setTotalBudgetEUR(Number(e.target.value))}
            className="w-full h-1 bg-[#f6f5f4] rounded-full appearance-none cursor-pointer accent-[#0075de]"
          />
        </div>

        {/* Slider 2: Travelers Count */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-[#757575] font-medium">Travelers</span>
            <span className="font-bold text-[#000000]">{numTravelers} Members</span>
          </div>
          <input
            type="range"
            min="2"
            max="12"
            step="1"
            value={numTravelers}
            onChange={(e) => setNumTravelers(Number(e.target.value))}
            className="w-full h-1 bg-[#f6f5f4] rounded-full appearance-none cursor-pointer accent-[#0075de]"
          />
        </div>

        {/* Slider 3: Spend Percentage */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-[#757575] font-medium">Budget Consumed</span>
            <span className="font-bold text-[#000000]">{spentPercent}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            step="5"
            value={spentPercent}
            onChange={(e) => setSpentPercent(Number(e.target.value))}
            className="w-full h-1 bg-[#f6f5f4] rounded-full appearance-none cursor-pointer accent-[#0075de]"
          />
        </div>
      </div>

      {/* 3 Metric Cards like Kanban task cards (White surfaces, 8px radius, hairline border) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
        <div className="p-4 rounded-[8px] bg-[#f6f5f4] border border-[rgba(0,0,0,0.06)]">
          <span className="text-[11px] uppercase tracking-wider text-[#757575] font-semibold block">
            Total Spent
          </span>
          <div className="text-2xl font-bold text-[#000000] tracking-tight mt-1">
            {format(totalSpent)}
          </div>
          <span className="text-xs text-[#757575] mt-1 block">
            {spentPercent}% of total target
          </span>
        </div>

        <div className="p-4 rounded-[8px] bg-[#f6f5f4] border border-[rgba(0,0,0,0.06)]">
          <span className="text-[11px] uppercase tracking-wider text-[#757575] font-semibold block">
            Fair Share / Person
          </span>
          <div className="text-2xl font-bold text-[#0075de] tracking-tight mt-1">
            {format(perPersonShare)}
          </div>
          <span className="text-xs text-[#757575] mt-1 block">
            Equal split across {numTravelers}
          </span>
        </div>

        <div className="p-4 rounded-[8px] bg-[#f6f5f4] border border-[rgba(0,0,0,0.06)]">
          <span className="text-[11px] uppercase tracking-wider text-[#757575] font-semibold block">
            Remaining Buffer
          </span>
          <div className="text-2xl font-bold text-[#f64932] tracking-tight mt-1">
            {format(remainingBudget)}
          </div>
          <span className="text-xs text-[#757575] mt-1 block">
            Available for trip
          </span>
        </div>
      </div>
    </div>
  );
};
