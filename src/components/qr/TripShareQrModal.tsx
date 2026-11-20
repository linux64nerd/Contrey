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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden text-center flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plane className="w-5 h-5 -rotate-45" />
            <h3 className="text-sm font-bold">Trip Share Pass</h3>
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
          <div>
            <h4 className="text-lg font-black text-slate-900">{trip.name}</h4>
            <p className="text-xs text-slate-500 font-medium">
              {trip.destination} • {trip.travelers.length} Crew Members
            </p>
          </div>

          {/* QR */}
          <div
            ref={qrRef}
            className="p-4 bg-white rounded-2xl border border-slate-200 shadow-inner inline-block mx-auto"
          >
            <QRCodeCanvas
              value={sharePayload}
              size={180}
              level="H"
              marginSize={2}
              fgColor="#064e3b"
            />
          </div>

          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-xs space-y-0.5">
            <span className="text-emerald-800 font-semibold block">Total Group Spend Plotted</span>
            <span className="text-base font-extrabold text-emerald-950">
              {format(convertedTotal)}
            </span>
            <p className="text-[10px] text-emerald-700 pt-0.5">
              Scan to view trip breakdown on Contrey
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handleCopyLink}
              className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy URL</span>
            </button>
            <button
              onClick={handleDownloadQr}
              className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5 transition-all"
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
