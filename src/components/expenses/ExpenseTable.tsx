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
    <div className="contrey-card overflow-hidden dark:bg-slate-900 dark:border-slate-800">
      {/* Search and Filters Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search expenses by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">All Categories ({expenses.length})</option>
            <option value="Hotels">Hotels</option>
            <option value="Food">Dining & Cafés</option>
            <option value="Transportation">Transportation</option>
            <option value="Shopping">Shopping</option>
            <option value="Activities">Activities</option>
          </select>
        </div>
      </div>

      {/* Table view */}
      {filteredExpenses.length === 0 ? (
        <div className="p-12 text-center text-slate-400 dark:text-slate-500 space-y-2">
          <p className="font-heading text-sm font-bold text-slate-700 dark:text-slate-300">No matching expenses found</p>
          <p className="text-xs">Adjust your search keyword or add a new expense.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-3">Expense / Date</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Paid By</th>
                <th className="px-5 py-3">Split Method</th>
                <th className="px-5 py-3 text-right">Amount ({currentCurrency})</th>
                <th className="px-5 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-900 dark:text-slate-100">
              {filteredExpenses.map((expense) => {
                const payer = travelerMap.get(expense.paidById);
                const convertedAmount = convertAmount(expense.amount, expense.currency, currentCurrency);

                return (
                  <tr
                    key={expense.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors duration-150 group"
                  >
                    {/* Title & Date */}
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-sm text-slate-900 dark:text-white">{expense.title}</div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{formatDate(expense.date)}</span>
                        {expense.notes && (
                          <span className="ml-1 text-slate-400 dark:text-slate-500 italic truncate max-w-xs">
                            — {expense.notes}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-3.5">
                      <CategoryBadge category={expense.category} size="sm" />
                    </td>

                    {/* Paid By */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 font-bold text-[10px] flex items-center justify-center">
                          {payer ? payer.name.charAt(0) : '?'}
                        </div>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {payer ? payer.name : 'Unknown'}
                        </span>
                      </div>
                    </td>

                    {/* Split Type */}
                    <td className="px-5 py-3.5">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-semibold">
                        {expense.splitType === 'equal' ? 'Equal Split' : 'Custom Split'}
                      </span>
                    </td>

                    {/* Converted Amount */}
                    <td className="px-5 py-3.5 text-right">
                      <span className="font-heading font-extrabold text-sm text-slate-900 dark:text-white block">
                        {format(convertedAmount)}
                      </span>
                      {expense.currency !== currentCurrency && (
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">
                          Orig: {expense.amount} {expense.currency}
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onEditExpense(expense)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                          title="Edit Expense"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteExpense(expense.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/50 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
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
