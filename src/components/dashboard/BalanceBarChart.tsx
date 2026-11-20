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

interface BalanceBarChartProps {
  balances: TravelerBalance[];
  baseCurrency: string;
}

export const BalanceBarChart: React.FC<BalanceBarChartProps> = ({
  balances,
  baseCurrency,
}) => {
  const { currentCurrency, format, convertAmount } = useCurrency();

  const chartData = balances.map((b) => {
    const paid = convertAmount(b.totalPaid, baseCurrency as any, currentCurrency);
    const share = convertAmount(b.fairShare, baseCurrency as any, currentCurrency);
    const net = paid - share;

    return {
      name: b.name.split(' ')[0], // First name for clean mobile axis
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
        <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-xl text-xs space-y-1.5 border border-slate-700 min-w-[160px]">
          <p className="font-bold text-slate-200 border-b border-slate-700 pb-1">{item.fullName}</p>
          <div className="flex justify-between">
            <span className="text-emerald-400">Total Paid:</span>
            <span className="font-extrabold">{format(item.paid)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Fair Share:</span>
            <span className="font-extrabold">{format(item.share)}</span>
          </div>
          <div className="flex justify-between pt-1 border-t border-slate-800">
            <span className={item.net >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
              Net Balance:
            </span>
            <span
              className={`font-black ${
                item.net >= 0 ? 'text-emerald-400' : 'text-rose-400'
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
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
      <div className="mb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
          Individual Balance
        </span>
        <h3 className="text-base font-extrabold text-slate-900">Paid vs. Fair Share Comparison</h3>
      </div>

      {chartData.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-xs text-slate-400">
          No traveler balances to display.
        </div>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                iconType="circle"
              />
              <Bar dataKey="paid" name="Amount Paid" fill="#10b981" radius={[6, 6, 0, 0]} />
              <Bar dataKey="share" name="Fair Share" fill="#94a3b8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
