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
      name: b.name.split(' ')[0], // First name for clean axis
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
        <div className="bg-[#ffffff] text-[#000000] p-3 rounded-[8px] border border-[rgba(0,0,0,0.12)] shadow-[0_4px_12px_rgba(0,0,0,0.08)] text-xs space-y-1.5 min-w-[170px]">
          <p className="font-bold text-[#000000] border-b border-[rgba(0,0,0,0.08)] pb-1">{item.fullName}</p>
          <div className="flex justify-between">
            <span className="text-[#757575]">Total Paid:</span>
            <span className="font-bold text-[#000000]">{format(item.paid)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#757575]">Fair Share:</span>
            <span className="font-bold text-[#000000]">{format(item.share)}</span>
          </div>
          <div className="flex justify-between pt-1 border-t border-[rgba(0,0,0,0.08)]">
            <span className="text-[#757575]">Net Balance:</span>
            <span
              className={`font-bold ${
                item.net >= 0 ? 'text-[#0075de]' : 'text-[#f64932]'
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
    <div className="bg-[#ffffff] rounded-[12px] p-6 border border-[rgba(0,0,0,0.08)] flex flex-col justify-between">
      <div className="mb-4">
        <span className="text-xs uppercase tracking-wider font-semibold text-[#757575] block">
          Individual Balances
        </span>
        <h3 className="text-base font-bold text-[#000000] tracking-tight mt-0.5">
          Paid vs. fair share
        </h3>
      </div>

      {chartData.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-xs text-[#757575]">
          No traveler balances to display.
        </div>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0efed" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#757575' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#757575' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                iconType="circle"
              />
              <Bar dataKey="paid" name="Amount Paid" fill="#0075de" radius={[4, 4, 0, 0]} />
              <Bar dataKey="share" name="Fair Share" fill="#d1d5db" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
