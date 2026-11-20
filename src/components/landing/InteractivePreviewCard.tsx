import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

export const InteractivePreviewCard: React.FC = () => {
  const { currentCurrency, format, convertAmount } = useCurrency();

  // Internal interactive state for preview demonstration
  const [totalBudgetEUR, setTotalBudgetEUR] = useState<number>(1200);
  const [numTravelers, setNumTravelers] = useState<number>(4);
  const [spentPercent, setSpentPercent] = useState<number>(65);

  const totalBudget = convertAmount(totalBudgetEUR, 'EUR', currentCurrency);
  const totalSpent = (totalBudget * spentPercent) / 100;
  const perPersonShare = totalSpent / numTravelers;
  const remainingBudget = totalBudget - totalSpent;

  return (
    <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-white/95 to-slate-50/95 border border-slate-200/80 shadow-2xl backdrop-blur-xl">
      {/* Decorative Badge */}
      <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-bold shadow-md flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
        Live Interactive Calculator
      </div>

      <div className="flex items-center justify-between pb-5 border-b border-slate-100">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
            Trip Simulation
          </span>
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            Goa Coastal Adventure 🌴
          </h3>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400 font-medium">Active Currency</span>
          <p className="text-sm font-bold text-slate-800">{currentCurrency}</p>
        </div>
      </div>

      {/* Sliders for real-time interactivity */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 my-6">
        <div>
          <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
            <span>Trip Budget</span>
            <span className="text-emerald-700 font-bold">{format(totalBudget)}</span>
          </div>
          <input
            type="range"
            min="300"
            max="5000"
            step="100"
            value={totalBudgetEUR}
            onChange={(e) => setTotalBudgetEUR(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>Budget: Low</span>
            <span>Budget: Luxury</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
            <span>Travelers in Group</span>
            <span className="text-emerald-700 font-bold">{numTravelers} Friends</span>
          </div>
          <input
            type="range"
            min="2"
            max="10"
            step="1"
            value={numTravelers}
            onChange={(e) => setNumTravelers(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>2 People</span>
            <span>10 People</span>
          </div>
        </div>
      </div>

      {/* Dynamic Spent Slider */}
      <div className="mb-6">
        <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
          <span>Spend Pace (% of Budget)</span>
          <span className={`${spentPercent >= 80 ? 'text-amber-600 font-bold' : 'text-slate-700'}`}>
            {spentPercent}% ({format(totalSpent)})
          </span>
        </div>
        <input
          type="range"
          min="10"
          max="100"
          step="5"
          value={spentPercent}
          onChange={(e) => setSpentPercent(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
        />
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mt-2 border border-slate-200">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              spentPercent >= 80
                ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500'
            }`}
            style={{ width: `${spentPercent}%` }}
          />
        </div>
      </div>

      {/* Real-time KPI summary widgets */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[11px] text-slate-500 font-medium block">Total Spent</span>
          <span className="text-base font-bold text-slate-900">{format(totalSpent)}</span>
        </div>
        <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100">
          <span className="text-[11px] text-emerald-800 font-medium block">Fair Share / Person</span>
          <span className="text-base font-bold text-emerald-900">{format(perPersonShare)}</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[11px] text-slate-500 font-medium block">Remaining Buffer</span>
          <span className={`text-base font-bold ${remainingBudget < 0 ? 'text-rose-600' : 'text-slate-900'}`}>
            {format(remainingBudget)}
          </span>
        </div>
        <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-100">
          <span className="text-[11px] text-teal-800 font-medium block">Settlements</span>
          <span className="text-base font-bold text-teal-900">1 Minimal Txn</span>
        </div>
      </div>

      {/* Simulated Minimum Transaction */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-emerald-400" />
          <span>
            <strong className="text-emerald-300">Rahul</strong> pays{' '}
            <strong className="text-emerald-300">Aisha</strong>
          </span>
        </div>
        <span className="font-extrabold text-sm text-emerald-400 px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800">
          {format(perPersonShare * 0.8)}
        </span>
      </div>
    </div>
  );
};
