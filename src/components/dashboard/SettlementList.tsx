import React from 'react';
import { Settlement, Traveler } from '../../types/trip';
import { CurrencyCode } from '../../types/currency';
import { useCurrency } from '../../context/CurrencyContext';
import { CheckCircle2, ArrowRight, MessageSquare, QrCode } from 'lucide-react';
import { generateSettlementWhatsAppUrl } from '../../utils/whatsapp';

interface SettlementListProps {
  settlements: Settlement[];
  travelers: Traveler[];
  baseCurrency: CurrencyCode;
  tripName?: string;
  onToggleSettlement: (settlementId: string) => void;
  onOpenQr?: (settlement: Settlement, debtor: Traveler, creditor: Traveler) => void;
}

export const SettlementList: React.FC<SettlementListProps> = ({
  settlements,
  travelers,
  baseCurrency,
  tripName = 'Trip',
  onToggleSettlement,
  onOpenQr,
}) => {
  const { currentCurrency, format, convertAmount } = useCurrency();
  const travelerMap = new Map((travelers || []).map((t) => [t.id, t]));

  const symbols: Record<string, string> = {
    INR: '₹',
    EUR: '€',
    USD: '$',
  };

  return (
    <div className="contrey-card p-6 space-y-4 dark:bg-slate-900 dark:border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <span className="text-[11px] uppercase tracking-wider font-bold text-indigo-600 dark:text-indigo-400 block">
            Greedy Optimization Engine
          </span>
          <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white tracking-tight mt-0.5 flex items-center gap-2">
            <span>Minimum-Transaction Debt Plan</span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
              Optimal greedy resolution
            </span>
          </h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Resolves all group debts in the fewest possible transfers.
        </p>
      </div>

      {settlements.length === 0 ? (
        <div className="p-10 text-center text-slate-500 dark:text-slate-400 space-y-2">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
          <p className="font-heading text-base font-bold text-slate-900 dark:text-white">All balances are settled!</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">No pending transfers needed across your crew.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {settlements.map((s, sIdx) => {
            const debtor = travelerMap.get(s.fromTravelerId) || {
              id: s.fromTravelerId,
              name: 'Crew Member',
              phone: '',
            };
            const creditor = travelerMap.get(s.toTravelerId) || {
              id: s.toTravelerId,
              name: 'Crew Member',
              phone: '',
            };
            const convertedAmount = convertAmount(s.amount, baseCurrency, currentCurrency);

            const whatsAppUrl = generateSettlementWhatsAppUrl(
              debtor.phone,
              debtor.name,
              creditor.name,
              convertedAmount,
              symbols[currentCurrency] || currentCurrency,
              creditor.upiId,
              tripName
            );

            const staggerClass = `stagger-${(sIdx % 6) + 1}`;

            return (
              <div
                key={s.id}
                className={`p-4 rounded-xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover-lift-sm animate-fade-in-up ${staggerClass} ${
                  s.isSettled
                    ? 'bg-slate-50/70 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 opacity-60'
                    : 'bg-white dark:bg-slate-800/80 border-slate-200/90 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 shadow-xs'
                }`}
              >
                {/* Flow: A pays B */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 transition-transform hover:scale-110 ${
                      s.isSettled
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                        : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                    }`}
                  >
                    <span>{debtor.name.charAt(0)}</span>
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                      <span>{debtor.name}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-indigo-600 dark:text-indigo-400">{creditor.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                      <span>Ref: #{s.id.slice(-6)}</span>
                      {creditor.upiId && (
                        <span>• UPI: <span className="font-mono text-slate-700 dark:text-slate-300">{creditor.upiId}</span></span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Amount & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                  <div className="text-right">
                    <span className="font-heading text-lg font-extrabold text-slate-900 dark:text-white tracking-tight block">
                      {format(convertedAmount)}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider ${
                        s.isSettled ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      {s.isSettled ? 'Settled' : 'Pending'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Instant QR Code Trigger */}
                    {onOpenQr && !s.isSettled && (
                      <button
                        onClick={() => onOpenQr(s, debtor, creditor)}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        title="Show Payment QR Code"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>
                    )}

                    {/* WhatsApp Reminder Button */}
                    {!s.isSettled && (
                      <a
                        href={whatsAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs font-semibold transition-colors border border-emerald-200 dark:border-emerald-800"
                        title="Send WhatsApp payment link"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">WhatsApp</span>
                      </a>
                    )}

                    {/* Toggle Settled Status */}
                    <button
                      onClick={() => onToggleSettlement(s.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        s.isSettled
                          ? 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                      }`}
                    >
                      {s.isSettled ? 'Mark Unpaid' : 'Mark Settled'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
