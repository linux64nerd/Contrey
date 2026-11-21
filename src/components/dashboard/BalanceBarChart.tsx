import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { TravelerBalance } from '../../services/settlementEngine';
import { useCurrency } from '../../context/CurrencyContext';
import { useTheme } from '../../context/ThemeContext';

interface BalanceBarChartProps {
  balances: TravelerBalance[];
  baseCurrency: string;
}

export const BalanceBarChart: React.FC<BalanceBarChartProps> = ({
  balances,
  baseCurrency,
}) => {
  const { currentCurrency, format, convertAmount } = useCurrency();
  const { isDark } = useTheme();

  const chartData = balances.map((b) => {
    const paid = convertAmount(b.totalPaid, baseCurrency as any, currentCurrency);
    const share = convertAmount(b.fairShare, baseCurrency as any, currentCurrency);
    const net = paid - share;

    return {
      name: b.name.split(' ')[0],
      fullName: b.name,
      paid: Math.round(paid * 100) / 100,
      share: Math.round(share * 100) / 100,
      net: Math.round(net * 100) / 100,
    };
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-700 shadow-xl text-xs space-y-1.5 min-w-[170px]">
          <p className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-1 font-heading">
            {item.fullName}
          </p>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Total Paid:</span>
            <span className="font-bold text-slate-900 dark:text-white">{format(item.paid)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Fair Share:</span>
            <span className="font-bold text-slate-900 dark:text-white">{format(item.share)}</span>
          </div>
          <div className="flex justify-between pt-1 border-t border-slate-100 dark:border-slate-700">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Net Position:</span>
            <span
              className={`font-bold ${
                item.net >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {item.net >= 0 ? `+${format(item.net)}` : format(item.net)}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="contrey-card p-6 flex flex-col justify-between dark:bg-slate-900 dark:border-slate-800">
      <div className="mb-4">
        <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 block">
          Individual Equity
        </span>
        <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white tracking-tight mt-0.5">
          Amount Paid vs. Fair Share
        </h3>
      </div>

      {chartData.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center text-xs text-slate-400 space-y-1">
          <span>👥</span>
          <span>No traveler balances to display.</span>
        </div>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#1e293b' : '#f1f5f9'} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: isDark ? '#94a3b8' : '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: isDark ? '#94a3b8' : '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                iconType="circle"
              />
              <Bar dataKey="paid" name="Amount Paid" fill="#4d49fc" radius={[6, 6, 0, 0]} />
              <Bar dataKey="share" name="Fair Share" fill={isDark ? '#334155' : '#cbd5e1'} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
