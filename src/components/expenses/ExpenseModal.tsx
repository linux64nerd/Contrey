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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-[#ffffff] rounded-[12px] shadow-[0_4px_16px_rgba(0,0,0,0.15)] border border-[rgba(0,0,0,0.08)] overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-[#ffffff] border-b border-[rgba(0,0,0,0.08)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-[#0075de]" />
            <h3 className="text-base font-bold text-[#000000]">
              {initialExpense ? 'Edit Expense' : 'Record New Expense'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-[6px] hover:bg-[#f6f5f4] text-[#757575] hover:text-[#000000] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs font-normal">
          {/* Title & Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-[#000000] mb-1">
                Expense Title
              </label>
              <input
                type="text"
                placeholder="e.g. Seafood Dinner, Surf Lessons"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-[8px] bg-[#ffffff] border border-[rgba(0,0,0,0.12)] text-[#000000] text-xs focus:outline-none focus:border-[#0075de]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#000000] mb-1">
                Amount
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 rounded-[8px] bg-[#ffffff] border border-[rgba(0,0,0,0.12)] text-[#000000] font-bold text-xs focus:outline-none focus:border-[#0075de]"
                required
              />
            </div>
          </div>

          {/* Currency & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#000000] mb-1">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="w-full px-3 py-2 rounded-[8px] bg-[#ffffff] border border-[rgba(0,0,0,0.12)] text-[#000000] text-xs focus:outline-none focus:border-[#0075de]"
              >
                <option value="INR">INR (₹) - Indian Rupee</option>
                <option value="EUR">EUR (€) - Euro</option>
                <option value="USD">USD ($) - US Dollar</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#000000] mb-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-[8px] bg-[#ffffff] border border-[rgba(0,0,0,0.12)] text-[#000000] text-xs focus:outline-none focus:border-[#0075de]"
              />
            </div>
          </div>

          {/* Category Selector Chips */}
          <div>
            <label className="block text-xs font-medium text-[#000000] mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {(Object.keys(CATEGORY_CONFIG) as ExpenseCategory[]).map((cat) => {
                const conf = CATEGORY_CONFIG[cat];
                const Icon = conf.icon;
                const isSelected = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`p-2 rounded-[8px] border flex flex-col items-center justify-center gap-1 transition-all ${
                      isSelected
                        ? `${conf.bgClass} ${conf.colorClass} border-[#0075de] font-semibold ring-1 ring-[#0075de]`
                        : 'bg-[#f6f5f4] border-[rgba(0,0,0,0.06)] text-[#615d59] hover:bg-[#ffffff]'
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
            <label className="block text-xs font-medium text-[#000000] mb-1">
              Paid By
            </label>
            <select
              value={paidById}
              onChange={(e) => setPaidById(e.target.value)}
              className="w-full px-3 py-2 rounded-[8px] bg-[#ffffff] border border-[rgba(0,0,0,0.12)] text-[#000000] font-medium text-xs focus:outline-none focus:border-[#0075de]"
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
              <label className="text-xs font-medium text-[#000000]">Split Method</label>
              {splitType === 'custom' && (
                <button
                  type="button"
                  onClick={handleDistributeCustomEqually}
                  className="text-xs text-[#0075de] hover:underline font-medium"
                >
                  Distribute Equally
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 p-1 bg-[#f6f5f4] rounded-[8px] border border-[rgba(0,0,0,0.06)]">
              <button
                type="button"
                onClick={() => setSplitType('equal')}
                className={`py-1.5 rounded-[6px] font-medium transition-all ${
                  splitType === 'equal'
                    ? 'bg-[#ffffff] text-[#0075de] shadow-xs font-semibold'
                    : 'text-[#757575] hover:text-[#000000]'
                }`}
              >
                Equal Split ({travelers.length})
              </button>
              <button
                type="button"
                onClick={() => setSplitType('custom')}
                className={`py-1.5 rounded-[6px] font-medium transition-all ${
                  splitType === 'custom'
                    ? 'bg-[#ffffff] text-[#0075de] shadow-xs font-semibold'
                    : 'text-[#757575] hover:text-[#000000]'
                }`}
              >
                Custom Split
              </button>
            </div>
          </div>

          {/* Custom Split Allocation Table */}
          {splitType === 'custom' && (
            <div className="p-3 rounded-[8px] bg-[#f6f5f4] border border-[rgba(0,0,0,0.08)] space-y-2">
              <div className="flex justify-between items-center text-xs font-medium text-[#757575]">
                <span>Traveler</span>
                <span>Custom Share ({currency})</span>
              </div>

              {travelers.map((t) => (
                <div key={t.id} className="flex items-center justify-between gap-3">
                  <span className="text-[#000000] font-normal truncate flex-1">{t.name}</span>
                  <div className="w-28">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={customSplits[t.id] || ''}
                      onChange={(e) => handleCustomSplitChange(t.id, e.target.value)}
                      className="w-full px-2.5 py-1 rounded-[6px] bg-[#ffffff] border border-[rgba(0,0,0,0.12)] text-right font-mono text-[#000000] focus:outline-none focus:border-[#0075de]"
                    />
                  </div>
                </div>
              ))}

              <div className="pt-2 border-t border-[rgba(0,0,0,0.08)] flex items-center justify-between text-xs">
                <span className="text-[#757575]">Unallocated Remaining:</span>
                <span
                  className={`font-mono font-bold ${
                    Math.abs(remainingCustom) < 0.05 ? 'text-[#0075de]' : 'text-[#f64932]'
                  }`}
                >
                  {remainingCustom} {currency}
                </span>
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-[#000000] mb-1">
              Notes / Receipt Reference (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Paid via card, Table 4"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-[8px] bg-[#ffffff] border border-[rgba(0,0,0,0.12)] text-[#000000] text-xs focus:outline-none focus:border-[#0075de]"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-[rgba(0,0,0,0.08)] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-[8px] text-[#757575] hover:text-[#000000] font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-[8px] bg-[#0075de] hover:bg-[#0066c0] text-[#ffffff] font-medium shadow-xs transition-colors"
            >
              {initialExpense ? 'Save Changes' : 'Record Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
