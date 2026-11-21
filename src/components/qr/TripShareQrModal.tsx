import React, { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { X, Download, Copy, Plane } from 'lucide-react';
import { Trip } from '../../types/trip';
import { useCurrency } from '../../context/CurrencyContext';
import { toast } from 'sonner';

interface TripShareQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: Trip;
  totalSpent: number;
}

export const TripShareQrModal: React.FC<TripShareQrModalProps> = ({
  isOpen,
  onClose,
  trip,
  totalSpent,
}) => {
  const { currentCurrency, format, convertAmount } = useCurrency();
  const qrRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://contrey.travel';
  const convertedTotal = convertAmount(totalSpent, trip.baseCurrency as any, currentCurrency);

  const sharePayload = `${currentUrl} | TRIP: ${trip.name} (${trip.destination}) | TOTAL SPENT: ${format(
    convertedTotal
  )} | TRAVELERS: ${trip.travelers.length}`;

  const handleDownloadQr = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `Contrey_Trip_Share_${trip.name.replace(/\s+/g, '_')}.png`;
      a.click();
      toast.success('Trip Share QR downloaded! 📥');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    toast.success('Trip link copied to clipboard!');
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
            <Plane className="w-4 h-4 text-[#0075de] -rotate-45" />
            <h3 className="text-sm font-bold text-[#000000]">Trip Share Pass</h3>
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
          <div>
            <h4 className="text-lg font-bold text-[#000000]">{trip.name}</h4>
            <p className="text-xs text-[#757575] mt-0.5">
              {trip.destination} • {trip.travelers.length} Crew Members
            </p>
          </div>

          {/* QR */}
          <div
            ref={qrRef}
            className="p-3 bg-[#ffffff] rounded-[8px] border border-[rgba(0,0,0,0.12)] inline-block mx-auto shadow-xs"
          >
            <QRCodeCanvas
              value={sharePayload}
              size={180}
              level="H"
              marginSize={2}
              fgColor="#000000"
            />
          </div>

          <div className="p-3 rounded-[8px] bg-[#f6f5f4] border border-[rgba(0,0,0,0.08)] text-xs space-y-0.5">
            <span className="text-[#757575] uppercase tracking-wider text-[10px] font-semibold block">Total Group Spend Plotted</span>
            <span className="text-base font-bold text-[#0075de]">
              {format(convertedTotal)}
            </span>
            <p className="text-[10px] text-[#757575] pt-0.5">
              Scan to view trip breakdown on Contrey
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handleCopyLink}
              className="flex-1 py-2 px-3 rounded-[8px] bg-[#f6f5f4] hover:bg-[rgba(0,0,0,0.05)] border border-[rgba(0,0,0,0.08)] text-[#000000] text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <Copy className="w-3.5 h-3.5 text-[#757575]" />
              <span>Copy URL</span>
            </button>
            <button
              onClick={handleDownloadQr}
              className="flex-1 py-2 px-3 rounded-[8px] bg-[#0075de] hover:bg-[#0066c0] text-[#ffffff] text-xs font-medium shadow-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Pass</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
