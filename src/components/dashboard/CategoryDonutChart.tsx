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

// Notion distinct palette for categories
const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  Hotels: '#0075de', // Notion Blue
  Food: '#ffb110', // Marigold Yellow
  Transportation: '#62aef0', // Sky Wash
  Shopping: '#f64932', // Coral Red
  Activities: '#02093a', // Midnight Ink
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
      color: CATEGORY_COLORS[name as ExpenseCategory] || '#757575',
    }));

  const totalSpent = chartData.reduce((acc, curr) => acc + curr.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percent = totalSpent > 0 ? ((data.value / totalSpent) * 100).toFixed(1) : 0;
      return (
        <div className="bg-[#ffffff] text-[#000000] p-3 rounded-[8px] border border-[rgba(0,0,0,0.12)] shadow-[0_4px_12px_rgba(0,0,0,0.08)] text-xs space-y-1">
          <p className="font-semibold flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: data.payload.color }}
            />
            <span>{data.name}</span>
          </p>
          <p className="font-bold text-sm text-[#0075de]">{format(data.value)}</p>
          <p className="text-[#757575] text-[11px]">{percent}% of spending</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#ffffff] rounded-[12px] p-6 border border-[rgba(0,0,0,0.08)] flex flex-col justify-between">
      <div className="mb-4">
        <span className="text-xs uppercase tracking-wider font-semibold text-[#757575] block">
          Category Distribution
        </span>
        <h3 className="text-base font-bold text-[#000000] tracking-tight mt-0.5">
          Spending by category
        </h3>
      </div>

      {chartData.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-xs text-[#757575]">
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
                outerRadius={92}
                paddingAngle={3}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Center stats */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] uppercase tracking-wider text-[#757575] font-semibold">
              Total
            </span>
            <span className="text-sm font-bold text-[#000000]">{format(totalSpent)}</span>
          </div>
        </div>
      )}

      {/* Legend Chips */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-[rgba(0,0,0,0.06)] text-xs text-[#615d59]">
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
