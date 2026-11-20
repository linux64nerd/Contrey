import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Expense, ExpenseCategory } from '../../types/expense';
import { useCurrency } from '../../context/CurrencyContext';

interface CategoryDonutChartProps {
  expenses: Expense[];
}

const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  Hotels: '#6366f1', // Indigo
  Food: '#f59e0b', // Amber
  Transportation: '#0284c7', // Sky Blue
  Shopping: '#f43f5e', // Rose
  Activities: '#10b981', // Emerald
};

export const CategoryDonutChart: React.FC<CategoryDonutChartProps> = ({ expenses }) => {
  const { currentCurrency, format, convertAmount } = useCurrency();

  // Aggregate expenses by category
  const categoryTotals: Record<string, number> = {
    Hotels: 0,
    Food: 0,
    Transportation: 0,
    Shopping: 0,
    Activities: 0,
  };

  expenses.forEach((e) => {
    const converted = convertAmount(e.amount, e.currency, currentCurrency);
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + converted;
  });

  const chartData = Object.entries(categoryTotals)
    .filter(([_, value]) => value > 0)
    .map(([name, value]) => ({
      name,
      value: Math.round(value * 100) / 100,
      color: CATEGORY_COLORS[name as ExpenseCategory] || '#94a3b8',
    }));

  const totalSpent = chartData.reduce((acc, curr) => acc + curr.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percent = totalSpent > 0 ? ((data.value / totalSpent) * 100).toFixed(1) : 0;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-xl text-xs space-y-1 border border-slate-700">
          <p className="font-bold flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: data.payload.color }}
            />
            {data.name}
          </p>
          <p className="text-emerald-400 font-extrabold text-sm">{format(data.value)}</p>
          <p className="text-slate-400 text-[10px]">{percent}% of total spending</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
      <div className="mb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
          Distribution
        </span>
        <h3 className="text-base font-extrabold text-slate-900">Spending by Category</h3>
      </div>

      {chartData.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-xs text-slate-400">
          No expenses recorded yet.
        </div>
      ) : (
        <div className="h-64 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Center stats */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Total
            </span>
            <span className="text-sm font-black text-slate-800">{format(totalSpent)}</span>
          </div>
        </div>
      )}

      {/* Legend Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-4 border-t border-slate-100 text-[11px] font-medium text-slate-600">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
