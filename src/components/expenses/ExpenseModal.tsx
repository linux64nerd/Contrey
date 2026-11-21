import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Receipt, Sparkles } from 'lucide-react';
import { Expense, ExpenseCategory, SplitDetail } from '../../types/expense';
import { Traveler } from '../../types/trip';
import { CurrencyCode } from '../../types/currency';
import { CATEGORY_CONFIG } from './CategoryBadge';
import { calculateExactEqualSplits } from '../../services/settlementEngine';
import { toast } from 'sonner';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (expenseData: Omit<Expense, 'id'>) => void;
  tripId: string;
  travelers: Traveler[];
  defaultCurrency: CurrencyCode;
  initialExpense?: Partial<Expense> | null;
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  tripId,
  travelers,
  defaultCurrency,
  initialExpense,
}) => {
  const [title, setTitle] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [currency, setCurrency] = useState<CurrencyCode>(defaultCurrency);
  const [category, setCategory] = useState<ExpenseCategory>('Food');
  const [paidById, setPaidById] = useState<string>('');
  const [splitType, setSplitType] = useState<'equal' | 'custom'>('equal');
  const [customSplits, setCustomSplits] = useState<Record<string, string>>({});
  const [date, setDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (initialExpense) {
      setTitle(initialExpense.title || '');
      setAmount(initialExpense.amount !== undefined ? initialExpense.amount.toString() : '');
      setCurrency(initialExpense.currency || defaultCurrency);
      setCategory(initialExpense.category || 'Food');
      setPaidById(initialExpense.paidById || (travelers.length > 0 ? travelers[0].id : ''));
      setSplitType(initialExpense.splitType || 'equal');
      setDate(
        initialExpense.date
          ? initialExpense.date.split('T')[0]
          : new Date().toISOString().split('T')[0]
      );
      setNotes(initialExpense.notes || '');

      const splitMap: Record<string, string> = {};
      (initialExpense.splits || []).forEach((s) => {
        splitMap[s.travelerId] = s.amount.toString();
      });
      setCustomSplits(splitMap);
    } else {
      setTitle('');
      setAmount('');
      setCurrency(defaultCurrency);
      setCategory('Food');
      setPaidById(travelers.length > 0 ? travelers[0].id : '');
      setSplitType('equal');
      setDate(new Date().toISOString().split('T')[0]);
      setNotes('');
      setCustomSplits({});
    }
  }, [initialExpense, isOpen, defaultCurrency, travelers]);

  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const totalAmountNum = parseFloat(amount) || 0;

  // Calculate remaining unallocated amount in custom split
  const customSum = Object.values(customSplits).reduce(
    (sum, val) => sum + (parseFloat(val) || 0),
    0
  );
  const remainingCustom = Math.round((totalAmountNum - customSum) * 100) / 100;

  const handleCustomSplitChange = (travelerId: string, val: string) => {
    setCustomSplits((prev) => ({
      ...prev,
      [travelerId]: val,
    }));
  };

  const handleDistributeCustomEqually = () => {
    if (totalAmountNum <= 0 || travelers.length === 0) return;
    const exactSplits = calculateExactEqualSplits(
      totalAmountNum,
      travelers.map((t) => t.id)
    );
    const newSplits: Record<string, string> = {};
    exactSplits.forEach((s) => {
      newSplits[s.travelerId] = s.amount.toFixed(2);
    });
    setCustomSplits(newSplits);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanTitle = title.trim().slice(0, 80);
    if (!cleanTitle) {
      toast.error('Please enter an expense title');
      return;
    }

    const numAmount = parseFloat(amount);
    if (!isFinite(numAmount) || isNaN(numAmount) || numAmount <= 0) {
      toast.error('Please enter a valid amount greater than 0');
      return;
    }
    if (numAmount > 100000000) {
      toast.error('Amount exceeds maximum threshold (100,000,000)');
      return;
    }

    if (!paidById) {
      toast.error('Please select who paid for this expense');
      return;
    }

    let finalSplits: SplitDetail[] = [];

    if (splitType === 'equal') {
      finalSplits = calculateExactEqualSplits(
        numAmount,
        travelers.map((t) => t.id)
      );
    } else {
      if (Math.abs(remainingCustom) > 0.01) {
        toast.error(`Custom splits sum (${customSum.toFixed(2)}) must equal total (${numAmount.toFixed(2)})`);
        return;
      }

      finalSplits = travelers.map((t) => ({
        travelerId: t.id,
        amount: Math.round((parseFloat(customSplits[t.id]) || 0) * 100) / 100,
      }));
    }

    onSubmit({
      tripId,
      title: cleanTitle,
      amount: numAmount,
      currency,
      category,
      paidById,
      splitType,
      splits: finalSplits,
      date: date || new Date().toISOString(),
      notes: notes.trim().slice(0, 200),
    });

    onClose();
  };

  const categories: ExpenseCategory[] = ['Hotels', 'Food', 'Transportation', 'Shopping', 'Activities'];

  const modalContent = (
    <div
      className="fixed inset-0 z-[100] flex min-h-screen items-center justify-center p-4 overflow-y-auto bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-lg my-auto bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] text-slate-900 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
                {initialExpense ? 'Edit Expense' : 'Record New Expense'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Logged with automatic greedy debt rebalancing
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Expense Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Seafood Dinner at Thalassa"
              className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              required
            />
          </div>

          {/* Amount and Currency */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Amount *
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
              >
                <option value="INR">INR (₹)</option>
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>
          </div>

          {/* Category Pills */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {categories.map((cat) => {
                const conf = CATEGORY_CONFIG[cat];
                const Icon = conf.icon;
                const isSelected = category === cat;
                return (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 text-[11px] font-semibold transition-all ${
                      isSelected
                        ? 'bg-indigo-50 dark:bg-indigo-950/70 border-indigo-500 dark:border-indigo-500 text-indigo-700 dark:text-indigo-300 shadow-xs'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="truncate">{conf.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Paid By & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Paid By *
              </label>
              <select
                value={paidById}
                onChange={(e) => setPaidById(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
                required
              >
                {travelers.map((t) => (
                  <option key={t.id} value={t.id} className="dark:bg-slate-800 dark:text-white">
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Split Type Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Split Strategy
              </label>
              <div className="flex gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <button
                  type="button"
                  onClick={() => setSplitType('equal')}
                  className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all ${
                    splitType === 'equal'
                      ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  Equal Split
                </button>
                <button
                  type="button"
                  onClick={() => setSplitType('custom')}
                  className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all ${
                    splitType === 'custom'
                      ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  Custom Split
                </button>
              </div>
            </div>

            {splitType === 'equal' ? (
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between">
                <span>
                  Split evenly across all {travelers.length} travelers:
                </span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">
                  {travelers.length > 0 ? (totalAmountNum / travelers.length).toFixed(2) : '0.00'} {currency}/each
                </span>
              </div>
            ) : (
              <div className="space-y-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400">Traveler Allocation</span>
                  <button
                    type="button"
                    onClick={handleDistributeCustomEqually}
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-semibold flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" /> Distribute Equally
                  </button>
                </div>

                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {travelers.map((t) => (
                    <div key={t.id} className="flex items-center justify-between gap-3 text-xs">
                      <span className="font-medium text-slate-800 dark:text-slate-200 truncate flex-1">{t.name}</span>
                      <div className="relative w-28">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={customSplits[t.id] || ''}
                          onChange={(e) => handleCustomSplitChange(t.id, e.target.value)}
                          placeholder="0.00"
                          className="w-full px-2 py-1 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-right font-mono text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Unallocated:</span>
                  <span
                    className={`font-mono font-bold ${
                      Math.abs(remainingCustom) < 0.01 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {remainingCustom.toFixed(2)} {currency}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Optional Notes
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Paid via GPay, includes 10% tip"
              className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary !py-2 !px-4 !text-xs !rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary !py-2 !px-5 !text-xs !rounded-xl"
            >
              {initialExpense ? 'Save Changes' : 'Record Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : null;
};
