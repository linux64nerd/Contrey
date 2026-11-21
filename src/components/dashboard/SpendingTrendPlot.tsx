import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Expense } from '../../types/expense';
import { useCurrency } from '../../context/CurrencyContext';
import { useTheme } from '../../context/ThemeContext';
import { formatDate } from '../../utils/formatters';

interface SpendingTrendPlotProps {
  expenses: Expense[];
  startDate: string;
  endDate: string;
  totalBudget: number;
  baseCurrency: string;
}

export const SpendingTrendPlot: React.FC<SpendingTrendPlotProps> = ({
  expenses,
  totalBudget,
  baseCurrency,
}) => {
  const { currentCurrency, format, convertAmount } = useCurrency();
  const { isDark } = useTheme();

  // Sort expenses chronologically
  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Group by date (YYYY-MM-DD)
  const dateSpendMap: Record<string, number> = {};
  sortedExpenses.forEach((e) => {
    const d = e.date ? e.date.split('T')[0] : '2026-11-20';
    const converted = convertAmount(e.amount, e.currency, currentCurrency);
    dateSpendMap[d] = (dateSpendMap[d] || 0) + converted;
  });

  // Calculate cumulative spend trajectory
  let cumulative = 0;
  const chartData = Object.entries(dateSpendMap).map(([date, daily]) => {
    cumulative += daily;
    return {
      date,
      formattedDate: formatDate(date),
      daily: Math.round(daily * 100) / 100,
      cumulative: Math.round(cumulative * 100) / 100,
    };
  });

  const convertedBudget = convertAmount(totalBudget, baseCurrency as any, currentCurrency);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-700 shadow-xl text-xs space-y-1.5 min-w-[150px]">
          <p className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-1 font-heading">
            {data.formattedDate}
          </p>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Daily Spend:</span>
            <span className="font-bold text-slate-900 dark:text-white">{format(data.daily)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Cumulative:</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">{format(data.cumulative)}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="contrey-card p-6 flex flex-col justify-between dark:bg-slate-900 dark:border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 block">
            Burn Rate & Velocity
          </span>
          <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white tracking-tight mt-0.5">
            Cumulative Spending Trajectory
          </h3>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold block">
            Trip Cap
          </span>
          <span className="text-xs font-bold text-slate-900 dark:text-white font-heading">
            {format(convertedBudget)}
          </span>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center text-xs text-slate-400 space-y-1">
          <span>📈</span>
          <span>No daily expenses recorded yet.</span>
        </div>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4d49fc" stopOpacity={isDark ? 0.4 : 0.25} />
                  <stop offset="95%" stopColor="#4d49fc" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#1e293b' : '#f1f5f9'} />
              <XAxis dataKey="formattedDate" tick={{ fontSize: 10, fill: isDark ? '#94a3b8' : '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: isDark ? '#94a3b8' : '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="cumulative"
                stroke="#4d49fc"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#spendGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
