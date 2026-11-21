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
    <div className="bg-[#ffffff] rounded-[12px] border border-[rgba(0,0,0,0.08)] overflow-hidden">
      {/* Search and Filters Header */}
      <div className="p-4 sm:p-5 border-b border-[rgba(0,0,0,0.06)] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#757575]" />
          <input
            type="text"
            placeholder="Search expenses by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-[8px] bg-[#f6f5f4] border border-[rgba(0,0,0,0.08)] text-xs text-[#000000] placeholder:text-[#757575] focus:outline-none focus:border-[#0075de]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-[#757575]" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-[8px] border border-[rgba(0,0,0,0.1)] text-xs font-medium text-[#000000] bg-[#ffffff] focus:outline-none focus:border-[#0075de] cursor-pointer"
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
        <div className="p-12 text-center text-[#757575] space-y-2">
          <p className="text-sm font-semibold text-[#000000]">No expenses found</p>
          <p className="text-xs">Adjust your search or click "New Expense" to add one.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f6f5f4] border-b border-[rgba(0,0,0,0.08)] text-[#757575] font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-3">Expense / Date</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Paid By</th>
                <th className="px-5 py-3">Split Type</th>
                <th className="px-5 py-3 text-right">Amount ({currentCurrency})</th>
                <th className="px-5 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(0,0,0,0.06)] text-[#000000]">
              {filteredExpenses.map((expense) => {
                const payer = travelerMap.get(expense.paidById);
                const convertedAmount = convertAmount(expense.amount, expense.currency, currentCurrency);

                return (
                  <tr key={expense.id} className="hover:bg-[#f6f5f4]/60 transition-colors">
                    {/* Title & Date */}
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-sm text-[#000000]">{expense.title}</div>
                      <div className="flex items-center gap-1.5 text-[11px] text-[#757575] mt-0.5">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(expense.date)}</span>
                        {expense.notes && (
                          <span className="ml-1 text-[#615d59] italic truncate max-w-xs">
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
                        <div className="w-6 h-6 rounded-[6px] bg-[#e6f3fe] text-[#0075de] font-bold flex items-center justify-center text-[10px]">
                          {payer ? payer.name.charAt(0) : '?'}
                        </div>
                        <span className="font-medium text-[#000000]">
                          {payer ? payer.name : 'Unknown'}
                        </span>
                      </div>
                    </td>

                    {/* Split Type */}
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                          expense.splitType === 'equal'
                            ? 'bg-[#f6f5f4] text-[#615d59] border-[rgba(0,0,0,0.08)]'
                            : 'bg-[#ffb110]/20 text-[#000000] border-[#ffb110]/40'
                        }`}
                      >
                        {expense.splitType === 'equal' ? 'Equal' : 'Custom'}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="px-5 py-3.5 text-right">
                      <div className="font-bold text-sm text-[#000000]">
                        {format(convertedAmount)}
                      </div>
                      {expense.currency !== currentCurrency && (
                        <div className="text-[10px] text-[#757575]">
                          Orig: {expense.currency} {expense.amount.toFixed(2)}
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onEditExpense(expense)}
                          className="p-1 rounded-[6px] text-[#757575] hover:text-[#0075de] hover:bg-[#e6f3fe] transition-colors"
                          title="Edit Expense"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteExpense(expense.id)}
                          className="p-1 rounded-[6px] text-[#757575] hover:text-[#f64932] hover:bg-[#f64932]/10 transition-colors"
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
