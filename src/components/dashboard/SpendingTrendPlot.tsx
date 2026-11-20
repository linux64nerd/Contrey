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
        <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-xl text-xs space-y-1.5 border border-slate-700 min-w-[150px]">
          <p className="font-bold text-slate-200 border-b border-slate-700 pb-1">{data.formattedDate}</p>
          <div className="flex justify-between">
            <span className="text-teal-300">Daily Spend:</span>
            <span className="font-extrabold">{format(data.daily)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-emerald-400">Cumulative:</span>
            <span className="font-black text-emerald-400">{format(data.cumulative)}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
            Velocity & Burn Rate
          </span>
          <h3 className="text-base font-extrabold text-slate-900">Cumulative Spending Trend</h3>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-slate-400 font-semibold block">Max Budget Cap</span>
          <span className="text-xs font-bold text-slate-800">{format(convertedBudget)}</span>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-xs text-slate-400">
          No daily expenses recorded yet.
        </div>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="formattedDate" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="cumulative"
                name="Cumulative Spend"
                stroke="#059669"
                strokeWidth={3}
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
