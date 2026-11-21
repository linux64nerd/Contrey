import React, { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
            <Plane className="w-4 h-4 text-indigo-600 dark:text-indigo-400 -rotate-45" />
            <h3 className="font-heading text-sm font-bold text-slate-900 dark:text-white">
              Trip Share Pass
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
          <div>
            <h4 className="font-heading text-lg font-bold text-slate-900 dark:text-white">{trip.name}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {trip.destination} • {trip.travelers.length} Crew Members
            </p>
          </div>

          {/* QR */}
          <div
            ref={qrRef}
            className="p-3 bg-white rounded-xl border border-slate-200 dark:border-slate-700 inline-block mx-auto shadow-sm"
          >
            <QRCodeCanvas
              value={sharePayload}
              size={180}
              level="H"
              marginSize={2}
              fgColor="#0f172a"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/80 text-xs space-y-0.5">
            <span className="text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px] font-bold block">
              Total Group Spend Plotted
            </span>
            <span className="font-heading text-base font-extrabold text-indigo-600 dark:text-indigo-400 block">
              {format(convertedTotal)}
            </span>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 pt-0.5">
              Scan to view trip breakdown on Contrey
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center gap-2 pt-1">
            <button
              onClick={handleDownloadQr}
              className="btn-secondary !py-2 !px-3.5 !text-xs !rounded-xl"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Pass</span>
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
