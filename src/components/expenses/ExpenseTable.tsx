import React, { useState } from 'react';
import { Expense } from '../../types/expense';
import { Traveler } from '../../types/trip';
import { useCurrency } from '../../context/CurrencyContext';
import { CategoryBadge } from './CategoryBadge';
import { Search, Filter, Edit3, Trash2, Calendar } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

interface ExpenseTableProps {
  expenses: Expense[];
  travelers: Traveler[];
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (expenseId: string) => void;
}

export const ExpenseTable: React.FC<ExpenseTableProps> = ({
  expenses,
  travelers,
  onEditExpense,
  onDeleteExpense,
}) => {
  const { currentCurrency, format, convertAmount } = useCurrency();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const travelerMap = new Map(travelers.map((t) => [t.id, t]));

  const filteredExpenses = expenses.filter((e) => {
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || e.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
      {/* Search and Filters Header */}
      <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search expenses by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="all">All Categories ({expenses.length})</option>
            <option value="Hotels">Hotels</option>
            <option value="Food">Food & Dining</option>
            <option value="Transportation">Transportation</option>
            <option value="Shopping">Shopping</option>
            <option value="Activities">Activities</option>
          </select>
        </div>
      </div>

      {/* Table view */}
      {filteredExpenses.length === 0 ? (
        <div className="p-12 text-center text-slate-400 space-y-2">
          <p className="text-sm font-semibold text-slate-600">No expenses found</p>
          <p className="text-xs">Adjust your search or click "Add Expense" to record one.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-6 py-3.5">Expense / Date</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Paid By</th>
                <th className="px-6 py-3.5">Split Type</th>
                <th className="px-6 py-3.5 text-right">Amount ({currentCurrency})</th>
                <th className="px-6 py-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredExpenses.map((expense) => {
                const payer = travelerMap.get(expense.paidById);
                const convertedAmount = convertAmount(expense.amount, expense.currency, currentCurrency);

                return (
                  <tr key={expense.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Title & Date */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 text-sm">{expense.title}</div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(expense.date)}</span>
                        {expense.notes && (
                          <span className="ml-2 text-slate-500 italic truncate max-w-xs">
                            — {expense.notes}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4">
                      <CategoryBadge category={expense.category} size="sm" />
                    </td>

                    {/* Paid By */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[10px]">
                          {payer ? payer.name.charAt(0) : '?'}
                        </div>
                        <span className="font-semibold text-slate-800">
                          {payer ? payer.name : 'Unknown'}
                        </span>
                      </div>
                    </td>

                    {/* Split Type */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                          expense.splitType === 'equal'
                            ? 'bg-slate-100 text-slate-700'
                            : 'bg-teal-50 text-teal-800 border border-teal-200'
                        }`}
                      >
                        {expense.splitType === 'equal' ? 'Equal Split' : 'Custom Split'}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4 text-right">
                      <div className="font-extrabold text-slate-900 text-sm">
                        {format(convertedAmount)}
                      </div>
                      {expense.currency !== currentCurrency && (
                        <div className="text-[10px] text-slate-400">
                          Orig: {expense.currency} {expense.amount.toFixed(2)}
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onEditExpense(expense)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                          title="Edit Expense"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteExpense(expense.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                          title="Delete Expense"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
