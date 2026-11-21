import React from 'react';
import { Settlement, Traveler } from '../../types/trip';
import { useCurrency } from '../../context/CurrencyContext';
import { RefreshCw, CheckCircle2, ArrowRight, MessageSquare, QrCode } from 'lucide-react';
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
  const travelerMap = new Map((travelers || []).map((t) => [t.id, t]));

  const symbols: Record<string, string> = {
    INR: '₹',
    EUR: '€',
    USD: '$',
  };

  return (
    <div className="bg-[#ffffff] rounded-[12px] p-6 border border-[rgba(0,0,0,0.08)] space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[rgba(0,0,0,0.06)]">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-[#757575] block">
            Greedy Settlement Algorithm
          </span>
          <h3 className="text-base font-bold text-[#000000] tracking-tight mt-0.5 flex items-center gap-2">
            <span>Minimum-transaction debt plan</span>
            <span className="px-2 py-0.5 rounded-full bg-[#e6f3fe] text-[#0075de] text-[10px] font-semibold">
              Optimal greedy resolution
            </span>
          </h3>
        </div>
        <p className="text-xs text-[#757575]">
          All debts resolved in the fewest possible payments.
        </p>
      </div>

      {settlements.length === 0 ? (
        <div className="p-10 text-center text-[#757575] space-y-2">
          <CheckCircle2 className="w-8 h-8 text-[#0075de] mx-auto" />
          <p className="text-sm font-semibold text-[#000000]">All balances settled!</p>
          <p className="text-xs">No pending transfers needed across your crew.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {settlements.map((s) => {
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
            const convertedAmount = convertAmount(s.amount, baseCurrency as any, currentCurrency);

            const whatsAppUrl = generateSettlementWhatsAppUrl(
              debtor.phone,
              debtor.name,
              creditor.name,
              convertedAmount,
              symbols[currentCurrency] || currentCurrency,
              creditor.upiId,
              tripName
            );

            return (
              <div
                key={s.id}
                className={`p-3.5 rounded-[8px] border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  s.isSettled
                    ? 'bg-[#f6f5f4] border-[rgba(0,0,0,0.06)] opacity-60'
                    : 'bg-[#ffffff] border-[rgba(0,0,0,0.1)] hover:border-[#0075de]/40'
                }`}
              >
                {/* Flow: A pays B */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-[6px] flex items-center justify-center text-xs font-semibold ${
                      s.isSettled
                        ? 'bg-[#f6f5f4] text-[#757575]'
                        : 'bg-[#e6f3fe] text-[#0075de]'
                    }`}
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#000000]">
                      <span>{debtor.name}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#757575]" />
                      <span className="text-[#0075de]">{creditor.name}</span>
                    </div>
                    <div className="text-[11px] text-[#757575] flex items-center gap-2 mt-0.5">
                      <span>UPI: {creditor.upiId || 'Not set'}</span>
                      <span>•</span>
                      <span>Phone: {debtor.phone || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Amount, WhatsApp, QR, and Mark Paid Actions */}
                <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-[rgba(0,0,0,0.06)]">
                  <div className="text-right mr-1">
                    <span className="text-base font-bold text-[#000000] block">
                      {format(convertedAmount)}
                    </span>
                    {baseCurrency !== currentCurrency && (
                      <span className="text-[10px] text-[#757575]">
                        {baseCurrency} {s.amount.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* 1-Click WhatsApp Button */}
                  <a
                    href={whatsAppUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1.5 rounded-[6px] bg-[#f6f5f4] hover:bg-[#e6f3fe] text-[#0075de] border border-[rgba(0,0,0,0.08)] text-xs font-medium flex items-center gap-1 transition-colors"
                    title="Send WhatsApp Reminder"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </a>

                  {/* Instant QR Payment Modal Trigger */}
                  {onOpenQr && (
                    <button
                      onClick={() => onOpenQr(s, debtor, creditor)}
                      className="px-2.5 py-1.5 rounded-[6px] bg-[#f6f5f4] hover:bg-[rgba(0,0,0,0.05)] text-[#000000] border border-[rgba(0,0,0,0.08)] text-xs font-medium flex items-center gap-1 transition-colors"
                      title="Open Instant QR Code"
                    >
                      <QrCode className="w-3.5 h-3.5 text-[#757575]" />
                      <span className="hidden sm:inline">Pay QR</span>
                    </button>
                  )}

                  {/* Toggle Settled Status */}
                  <button
                    onClick={() => onToggleSettlement(s.id)}
                    className={`px-3 py-1.5 rounded-[6px] text-xs font-medium transition-all ${
                      s.isSettled
                        ? 'bg-[#f6f5f4] text-[#757575] hover:bg-[#ffffff] border border-[rgba(0,0,0,0.08)]'
                        : 'bg-[#0075de] hover:bg-[#0066c0] text-[#ffffff] shadow-xs'
                    }`}
                  >
                    {s.isSettled ? 'Mark Unpaid' : 'Mark Paid'}
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
