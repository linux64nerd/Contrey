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
        <div className="bg-[#ffffff] text-[#000000] p-3 rounded-[8px] border border-[rgba(0,0,0,0.12)] shadow-[0_4px_12px_rgba(0,0,0,0.08)] text-xs space-y-1.5 min-w-[150px]">
          <p className="font-bold text-[#000000] border-b border-[rgba(0,0,0,0.08)] pb-1">{data.formattedDate}</p>
          <div className="flex justify-between">
            <span className="text-[#757575]">Daily Spend:</span>
            <span className="font-bold text-[#000000]">{format(data.daily)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#757575]">Cumulative:</span>
            <span className="font-bold text-[#0075de]">{format(data.cumulative)}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#ffffff] rounded-[12px] p-6 border border-[rgba(0,0,0,0.08)] flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-[#757575] block">
            Velocity & Burn Rate
          </span>
          <h3 className="text-base font-bold text-[#000000] tracking-tight mt-0.5">
            Cumulative spending trend
          </h3>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase tracking-wider text-[#757575] font-semibold block">Target Cap</span>
          <span className="text-xs font-bold text-[#000000]">{format(convertedBudget)}</span>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-xs text-[#757575]">
          No daily expenses recorded yet.
        </div>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="notionSpendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0075de" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#0075de" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0efed" />
              <XAxis dataKey="formattedDate" tick={{ fontSize: 10, fill: '#757575' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#757575' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="cumulative"
                name="Cumulative Spend"
                stroke="#0075de"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#notionSpendGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
