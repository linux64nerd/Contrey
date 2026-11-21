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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-sm bg-[#ffffff] rounded-[12px] shadow-[0_4px_16px_rgba(0,0,0,0.15)] border border-[rgba(0,0,0,0.08)] overflow-hidden text-center flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-[#ffffff] border-b border-[rgba(0,0,0,0.08)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="w-4 h-4 text-[#0075de]" />
            <h3 className="text-sm font-bold text-[#000000]">Instant Settlement QR</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-[6px] hover:bg-[#f6f5f4] text-[#757575] hover:text-[#000000] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#000000]">
            <span>{debtor.name}</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#757575]" />
            <span className="text-[#0075de]">{creditor.name}</span>
          </div>

          <div className="text-3xl font-bold text-[#000000] tracking-tight">
            {format(convertedAmount)}
          </div>

          {/* Scannable Canvas QR */}
          <div
            ref={qrRef}
            className="p-3 bg-[#ffffff] rounded-[8px] border border-[rgba(0,0,0,0.12)] inline-block mx-auto shadow-xs"
          >
            <QRCodeCanvas
              value={qrPayload}
              size={180}
              level="H"
              marginSize={2}
              fgColor="#000000"
            />
          </div>

          {/* Payment Method Details */}
          <div className="p-3 rounded-[8px] bg-[#f6f5f4] border border-[rgba(0,0,0,0.08)] text-xs text-[#615d59] space-y-0.5">
            <p className="font-semibold text-[#000000]">
              {isUpiSupported ? '📱 UPI Direct Transfer QR' : '💳 Bank / Card Transfer'}
            </p>
            {creditor.upiId && (
              <p className="font-mono text-[11px] text-[#0075de]">
                UPI ID: {creditor.upiId}
              </p>
            )}
            <p className="text-[10px] text-[#757575]">
              Scan with GPay, PhonePe, Paytm, or any banking app.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handleCopyLink}
              className="flex-1 py-2 px-3 rounded-[8px] bg-[#f6f5f4] hover:bg-[rgba(0,0,0,0.05)] border border-[rgba(0,0,0,0.08)] text-[#000000] text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <Copy className="w-3.5 h-3.5 text-[#757575]" />
              <span>Copy Link</span>
            </button>
            <button
              onClick={handleDownloadQr}
              className="flex-1 py-2 px-3 rounded-[8px] bg-[#0075de] hover:bg-[#0066c0] text-[#ffffff] text-xs font-medium shadow-xs flex items-center justify-center gap-1.5 transition-colors"
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
