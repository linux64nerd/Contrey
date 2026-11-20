import React, { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { X, QrCode, Download, Copy, ArrowRight } from 'lucide-react';
import { Settlement, Traveler } from '../../types/trip';
import { useCurrency } from '../../context/CurrencyContext';
import { generateUpiLink } from '../../utils/upi';
import { toast } from 'sonner';

interface SettlementQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  settlement: Settlement;
  debtor: Traveler;
  creditor: Traveler;
  baseCurrency: string;
}

export const SettlementQrModal: React.FC<SettlementQrModalProps> = ({
  isOpen,
  onClose,
  settlement,
  debtor,
  creditor,
  baseCurrency,
}) => {
  const { currentCurrency, format, convertAmount } = useCurrency();
  const qrRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const convertedAmount = convertAmount(settlement.amount, baseCurrency as any, currentCurrency);

  // Generate UPI payload if in INR, or generic payment string for EUR/USD
  const isUpiSupported = currentCurrency === 'INR' && creditor.upiId;

  const qrPayload = isUpiSupported
    ? generateUpiLink({
        pa: creditor.upiId || 'payee@upi',
        pn: creditor.name,
        am: convertedAmount,
        cu: 'INR',
        tn: `Contrey Trip Settlement from ${debtor.name}`,
      })
    : `PAYMENT TO: ${creditor.name} | AMOUNT: ${format(convertedAmount)} | FROM: ${debtor.name} | REF: Contrey Travel Settlement`;

  const handleDownloadQr = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `Contrey_Payment_${debtor.name}_to_${creditor.name}.png`;
      a.click();
      toast.success('Payment QR Code downloaded! 📥');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(qrPayload);
    toast.success('Payment link copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden text-center flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            <h3 className="text-sm font-bold">Instant Settlement QR</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-800">
            <span>{debtor.name}</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-emerald-700">{creditor.name}</span>
          </div>

          <div className="text-3xl font-black text-slate-900 tracking-tight">
            {format(convertedAmount)}
          </div>

          {/* Scannable Canvas QR */}
          <div
            ref={qrRef}
            className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-inner inline-block mx-auto"
          >
            <QRCodeCanvas
              value={qrPayload}
              size={180}
              level="H"
              marginSize={2}
              fgColor="#0f172a"
            />
          </div>

          {/* Payment Method Details */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-1">
            <p className="font-semibold text-slate-800">
              {isUpiSupported ? '📱 UPI Auto-Payment QR' : '💳 Bank / Card Transfer'}
            </p>
            {creditor.upiId && (
              <p className="font-mono text-[11px] text-emerald-800">
                UPI ID: {creditor.upiId}
              </p>
            )}
            <p className="text-[10px] text-slate-400">
              Scan with GPay, PhonePe, Paytm, or any banking app.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handleCopyLink}
              className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Link</span>
            </button>
            <button
              onClick={handleDownloadQr}
              className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download QR</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
