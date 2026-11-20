import React, { useState, useEffect } from 'react';
import { X, Receipt } from 'lucide-react';
import { Expense, ExpenseCategory, SplitDetail } from '../../types/expense';
import { Traveler } from '../../types/trip';
import { CurrencyCode } from '../../types/currency';
import { CATEGORY_CONFIG } from './CategoryBadge';
import { toast } from 'sonner';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (expenseData: Omit<Expense, 'id'>) => void;
  tripId: string;
  travelers: Traveler[];
  defaultCurrency: CurrencyCode;
  initialExpense?: Expense | null;
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
      setTitle(initialExpense.title);
      setAmount(initialExpense.amount.toString());
      setCurrency(initialExpense.currency);
      setCategory(initialExpense.category);
      setPaidById(initialExpense.paidById);
      setSplitType(initialExpense.splitType);
      setDate(initialExpense.date ? initialExpense.date.split('T')[0] : '');
      setNotes(initialExpense.notes || '');

      const splitMap: Record<string, string> = {};
      initialExpense.splits.forEach((s) => {
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
    const equalShare = (totalAmountNum / travelers.length).toFixed(2);
    const newSplits: Record<string, string> = {};
    travelers.forEach((t) => {
      newSplits[t.id] = equalShare;
    });
    setCustomSplits(newSplits);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Please enter an expense title');
      return;
    }
    if (totalAmountNum <= 0) {
      toast.error('Please enter a valid amount greater than 0');
      return;
    }
    if (!paidById) {
      toast.error('Please select who paid for this expense');
      return;
    }

    let finalSplits: SplitDetail[] = [];
    if (splitType === 'equal') {
      const perPerson = totalAmountNum / travelers.length;
      finalSplits = travelers.map((t) => ({
        travelerId: t.id,
        amount: Math.round(perPerson * 100) / 100,
      }));
    } else {
      if (Math.abs(remainingCustom) > 0.05) {
        toast.error(`Custom split totals do not match total expense. Remaining: ${remainingCustom}`);
        return;
      }
      finalSplits = travelers.map((t) => ({
        travelerId: t.id,
        amount: parseFloat(customSplits[t.id]) || 0,
      }));
    }

    onSubmit({
      tripId,
      title: title.trim(),
      amount: totalAmountNum,
      currency,
      category,
      paidById,
      splitType,
      splits: finalSplits,
      date: date ? new Date(date).toISOString() : new Date().toISOString(),
      notes: notes.trim(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5" />
            <h3 className="text-base font-bold">
              {initialExpense ? 'Edit Expense' : 'Add New Expense'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Title & Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Expense Title</label>
              <input
                type="text"
                placeholder="e.g. Scuba Diving Tour, Seafood Dinner"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Amount</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Currency & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
              >
                <option value="INR">INR (₹) - Indian Rupee</option>
                <option value="EUR">EUR (€) - Euro</option>
                <option value="USD">USD ($) - US Dollar</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Category Selector Chips */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">Category</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
              {(Object.keys(CATEGORY_CONFIG) as ExpenseCategory[]).map((cat) => {
                const conf = CATEGORY_CONFIG[cat];
                const Icon = conf.icon;
                const isSelected = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                      isSelected
                        ? `${conf.bgClass} ${conf.colorClass} border-emerald-500 font-bold shadow-sm ring-2 ring-emerald-500/20`
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[10px] truncate max-w-full">{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Paid By Selector */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Paid By (Who footed the bill?)</label>
            <select
              value={paidById}
              onChange={(e) => setPaidById(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              required
            >
              {travelers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} {t.upiId ? `(${t.upiId})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Split Type Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-semibold text-slate-700">Split Method</label>
              {splitType === 'custom' && (
                <button
                  type="button"
                  onClick={handleDistributeCustomEqually}
                  className="text-[10px] font-bold text-emerald-600 hover:underline"
                >
                  Distribute Equally
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setSplitType('equal')}
                className={`py-1.5 rounded-lg font-semibold transition-all ${
                  splitType === 'equal'
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Equal Split ({travelers.length} People)
              </button>
              <button
                type="button"
                onClick={() => setSplitType('custom')}
                className={`py-1.5 rounded-lg font-semibold transition-all ${
                  splitType === 'custom'
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Custom Split
              </button>
            </div>
          </div>

          {/* Custom Split Allocation Table */}
          {splitType === 'custom' && (
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between items-center text-[11px] font-semibold text-slate-600">
                <span>Member</span>
                <span>Custom Share ({currency})</span>
              </div>

              {travelers.map((t) => (
                <div key={t.id} className="flex items-center justify-between gap-3">
                  <span className="text-slate-800 font-medium truncate flex-1">{t.name}</span>
                  <div className="w-28">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={customSplits[t.id] || ''}
                      onChange={(e) => handleCustomSplitChange(t.id, e.target.value)}
                      className="w-full px-2.5 py-1 rounded-lg border border-slate-200 text-right font-mono text-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              ))}

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-600">Unallocated Remaining:</span>
                <span
                  className={`font-mono font-bold ${
                    Math.abs(remainingCustom) < 0.05 ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {remainingCustom} {currency}
                </span>
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Notes / Receipts (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Paid online, Invoice #1024"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-500/20 transition-all"
            >
              {initialExpense ? 'Save Changes' : 'Record Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
