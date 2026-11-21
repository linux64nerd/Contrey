import React, { useState } from 'react';
import { RefreshCw, Users, Wallet, ArrowUpRight, CheckCircle2 } from 'lucide-react';
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
    <div className="contrey-card p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl relative overflow-hidden transition-colors">
      {/* Top accent light glow */}
      <div className="absolute top-0 right-0 w-64 h-32 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xl shadow-xs border border-indigo-100 dark:border-indigo-900">
            🏖️
          </div>
          <div>
            <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Goa Beach Trip 2026
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Contrey Real-Time Group Expense Simulation
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-xs font-semibold text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800">
          <RefreshCw className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Active FX Currency: {currentCurrency}</span>
        </div>
      </div>

      {/* Sliders Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-slate-100 dark:border-slate-800">
        {/* Slider 1: Total Trip Target */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Trip Budget</span>
            <span className="font-bold text-slate-900 dark:text-white">{format(totalBudget)}</span>
          </div>
          <input
            type="range"
            min="400"
            max="5000"
            step="100"
            value={totalBudgetEUR}
            onChange={(e) => setTotalBudgetEUR(Number(e.target.value))}
            className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-indigo-600"
          />
        </div>

        {/* Slider 2: Travelers Count */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Travelers</span>
            <span className="font-bold text-slate-900 dark:text-white">{numTravelers} Members</span>
          </div>
          <input
            type="range"
            min="2"
            max="12"
            step="1"
            value={numTravelers}
            onChange={(e) => setNumTravelers(Number(e.target.value))}
            className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-indigo-600"
          />
        </div>

        {/* Slider 3: Spend Percentage */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Budget Consumed</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">{spentPercent}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            step="5"
            value={spentPercent}
            onChange={(e) => setSpentPercent(Number(e.target.value))}
            className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-indigo-600"
          />
        </div>
      </div>

      {/* 3 Metric Output Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
              Total Spent
            </span>
            <ArrowUpRight className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">
            {format(totalSpent)}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
            {spentPercent}% of budget cap
          </span>
        </div>

        <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-indigo-700 dark:text-indigo-300 font-bold">
              Fair Share / Person
            </span>
            <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 tracking-tight mt-1">
            {format(perPersonShare)}
          </div>
          <span className="text-[11px] text-indigo-600/80 dark:text-indigo-400/80 mt-0.5 block">
            Equal split among {numTravelers}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-emerald-700 dark:text-emerald-300 font-bold">
              Remaining Buffer
            </span>
            <Wallet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight mt-1">
            {format(remainingBudget)}
          </div>
          <span className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 mt-0.5 block">
            Safe trip buffer available
          </span>
        </div>
      </div>

      {/* Footer Callout */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
        <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5" /> Greedy Algorithm Auto-Balances Penny Residuals
        </span>
        <span className="text-slate-400 dark:text-slate-600">Interactive Preview</span>
      </div>
    </div>
  );
};
