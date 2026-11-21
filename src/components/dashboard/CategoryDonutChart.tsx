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
import { useTheme } from '../../context/ThemeContext';

interface CategoryDonutChartProps {
  expenses: Expense[];
}

export const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  Hotels: '#4d49fc', // Figma Electric Indigo
  Food: '#24cb71',   // Figma Green
  Transportation: '#00b6ff', // Figma Cyan
  Shopping: '#ff7237', // Figma Orange
  Activities: '#b98e01', // Figma Mustard
};

export const CategoryDonutChart: React.FC<CategoryDonutChartProps> = ({ expenses }) => {
  const { currentCurrency, format, convertAmount } = useCurrency();
  const { isDark } = useTheme();

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
        <div className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white p-3 rounded-xl border border-slate-200/90 dark:border-slate-700 shadow-xl text-xs space-y-1">
          <p className="font-bold flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: data.payload.color }}
            />
            <span>{data.name}</span>
          </p>
          <p className="font-extrabold text-sm text-indigo-600 dark:text-indigo-400">{format(data.value)}</p>
          <p className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">{percent}% of total spend</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="contrey-card p-6 flex flex-col justify-between dark:bg-slate-900 dark:border-slate-800">
      <div className="mb-4">
        <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 block">
          Category Allocation
        </span>
        <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white tracking-tight mt-0.5">
          Spending Breakdown by Category
        </h3>
      </div>

      {chartData.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center text-xs text-slate-400 space-y-1">
          <span>📊</span>
          <span>No expenses recorded yet.</span>
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
                outerRadius={92}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke={isDark ? '#0f172a' : '#ffffff'}
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Centered Donut Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Total</span>
            <span className="text-sm font-extrabold text-slate-900 dark:text-white font-heading">
              {format(totalSpent)}
            </span>
          </div>
        </div>
      )}

      {/* Legend chips */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-300">
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
