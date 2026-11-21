import React, { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { QRCodeCanvas } from 'qrcode.react';
import { X, QrCode, Download, Copy, ArrowRight } from 'lucide-react';
import { Settlement, Traveler } from '../../types/trip';
import { CurrencyCode } from '../../types/currency';
import { useCurrency } from '../../context/CurrencyContext';
import { generateUpiLink } from '../../utils/upi';
import { toast } from 'sonner';

interface SettlementQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  settlement: Settlement;
  debtor: Traveler;
  creditor: Traveler;
  baseCurrency: CurrencyCode;
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

  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const convertedAmount = convertAmount(settlement.amount, baseCurrency, currentCurrency);

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

  const modalContent = (
    <div
      className="fixed inset-0 z-[100] flex min-h-screen items-center justify-center p-4 overflow-y-auto bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-sm my-auto bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden text-center flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-slate-50/70 dark:bg-slate-850/80 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-heading text-sm font-bold text-slate-900 dark:text-white">
              Instant Settlement QR
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>{debtor.name}</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">{creditor.name}</span>
          </div>

          <div className="font-heading text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {format(convertedAmount)}
          </div>

          {/* Scannable Canvas QR - always white background for scannability */}
          <div
            ref={qrRef}
            className="p-3 bg-white rounded-xl border border-slate-200 dark:border-slate-700 inline-block mx-auto shadow-sm"
          >
            <QRCodeCanvas
              value={qrPayload}
              size={180}
              level="H"
              marginSize={2}
              fgColor="#0f172a"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/80 text-xs space-y-1">
            <span className="text-slate-500 dark:text-slate-400 font-medium block">
              {isUpiSupported ? 'NPCI UPI Scannable Payload' : 'Payment Ledger Reference'}
            </span>
            {creditor.upiId && (
              <span className="font-mono text-slate-800 dark:text-slate-200 font-bold block">
                {creditor.upiId}
              </span>
            )}
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              Scan with GPay, PhonePe, Paytm or banking app
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center gap-2 pt-1">
            <button
              onClick={handleDownloadQr}
              className="btn-secondary !py-2 !px-3.5 !text-xs !rounded-xl"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PNG</span>
            </button>
            <button
              onClick={handleCopyLink}
              className="btn-secondary !py-2 !px-3.5 !text-xs !rounded-xl"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Link</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : null;
};
