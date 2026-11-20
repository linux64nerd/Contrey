import React from 'react';
import { Settlement, Traveler } from '../../types/trip';
import { useCurrency } from '../../context/CurrencyContext';
import { RefreshCw, CheckCircle2, Clock, ArrowRight, MessageSquare, QrCode } from 'lucide-react';
import { generateSettlementWhatsAppUrl } from '../../utils/whatsapp';

interface SettlementListProps {
  settlements: Settlement[];
  travelers: Traveler[];
  baseCurrency: string;
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
  const travelerMap = new Map(travelers.map((t) => [t.id, t]));

  const symbols: Record<string, string> = {
    INR: '₹',
    EUR: '€',
    USD: '$',
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
            Smart Splitter Engine
          </span>
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <span>Minimum-Transaction Settlement Plan</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              Greedy Algorithm
            </span>
          </h3>
        </div>
        <p className="text-xs text-slate-500">
          All group debts reduced to the lowest possible number of transfers.
        </p>
      </div>

      {settlements.length === 0 ? (
        <div className="p-8 text-center text-slate-400 space-y-1.5">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
          <p className="text-sm font-bold text-slate-700">All Balances Settled!</p>
          <p className="text-xs">No pending transfers needed among travelers.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {settlements.map((s) => {
            const debtor = travelerMap.get(s.fromTravelerId);
            const creditor = travelerMap.get(s.toTravelerId);
            const convertedAmount = convertAmount(s.amount, baseCurrency as any, currentCurrency);

            const whatsAppUrl =
              debtor && creditor
                ? generateSettlementWhatsAppUrl(
                    debtor.phone,
                    debtor.name,
                    creditor.name,
                    convertedAmount,
                    symbols[currentCurrency] || currentCurrency,
                    creditor.upiId,
                    tripName
                  )
                : '#';

            return (
              <div
                key={s.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  s.isSettled
                    ? 'bg-slate-50 border-slate-200 opacity-60'
                    : 'bg-emerald-50/40 border-emerald-200 hover:shadow-md'
                }`}
              >
                {/* Flow: A pays B */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                      s.isSettled
                        ? 'bg-slate-200 text-slate-600'
                        : 'bg-emerald-600 text-white shadow-sm'
                    }`}
                  >
                    <RefreshCw className="w-4 h-4" />
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                      <span className="text-slate-900">{debtor?.name || 'Traveler A'}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-emerald-700">{creditor?.name || 'Traveler B'}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>UPI: {creditor?.upiId || 'Not set'}</span>
                      <span>•</span>
                      <span>WhatsApp: {debtor?.phone || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Amount, WhatsApp, QR, and Mark Paid Actions */}
                <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                  <div className="text-right mr-1">
                    <span className="text-base font-black text-slate-900 block">
                      {format(convertedAmount)}
                    </span>
                    {baseCurrency !== currentCurrency && (
                      <span className="text-[10px] text-slate-400">
                        {baseCurrency} {s.amount.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* 1-Click WhatsApp Button */}
                  <a
                    href={whatsAppUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 text-xs font-bold flex items-center gap-1 transition-colors"
                    title="Send Reminder via WhatsApp"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-green-600" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </a>

                  {/* Instant QR Payment Modal Trigger */}
                  {debtor && creditor && onOpenQr && (
                    <button
                      onClick={() => onOpenQr(s, debtor, creditor)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-bold flex items-center gap-1 transition-colors"
                      title="Open Instant QR Code"
                    >
                      <QrCode className="w-3.5 h-3.5 text-slate-700" />
                      <span className="hidden sm:inline">Pay QR</span>
                    </button>
                  )}

                  {/* Toggle Settled Status */}
                  <button
                    onClick={() => onToggleSettlement(s.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      s.isSettled
                        ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:scale-105'
                    }`}
                  >
                    {s.isSettled ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Settled</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-3.5 h-3.5" />
                        <span>Mark Paid</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
