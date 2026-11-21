import React from 'react';
import {
  RefreshCw,
  Coins,
  MapPin,
  BellRing,
  MessageSquare,
  QrCode
} from 'lucide-react';

export const FeaturesGrid: React.FC = () => {
  return (
    <section id="features" className="py-20 bg-[#f6f5f4] text-[#000000]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#757575]">
            Everything in one notebook
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#000000] tracking-[-1.89px]">
            Designed like a notebook. Powered like an engine.
          </h2>
          <p className="font-serif text-[18px] text-[#615d59] leading-[1.56]">
            Every feature works like a sticky note on your travel board, simplifying group economics.
          </p>
        </div>

        {/* 6 Sticky-Note Cards with rotating Notion accent cast */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1. Accent Card in Marigold (#ffb110) */}
          <div className="rounded-[12px] p-6 bg-[#ffb110] text-[#000000] flex flex-col justify-between transition-transform hover:-translate-y-1">
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-full bg-[#ffffff] flex items-center justify-center text-[#000000] shadow-sm">
                <RefreshCw className="w-4 h-4" />
              </div>
              <span className="text-xs uppercase tracking-wider font-bold text-[rgba(0,0,0,0.7)] block">
                Algorithm
              </span>
              <h3 className="text-xl font-bold tracking-tight">
                Greedy debt minimizer
              </h3>
              <p className="text-sm font-normal text-[rgba(0,0,0,0.85)] leading-relaxed">
                Condenses complex multi-person group debts into the fewest possible payments. Eliminates messy circular bank transfers.
              </p>
            </div>
          </div>

          {/* 2. White Feature Card (Pure White on warm canvas) */}
          <div className="rounded-[12px] p-6 bg-[#ffffff] border border-[rgba(0,0,0,0.08)] flex flex-col justify-between transition-transform hover:-translate-y-1">
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-full bg-[#f6f5f4] flex items-center justify-center text-[#0075de]">
                <Coins className="w-4 h-4" />
              </div>
              <span className="text-xs uppercase tracking-wider font-semibold text-[#757575] block">
                Currency
              </span>
              <h3 className="text-xl font-bold text-[#000000] tracking-tight">
                Real-time multi-currency FX
              </h3>
              <p className="text-sm text-[#615d59] leading-relaxed">
                Switch between INR, EUR, and USD instantly with live ECB rates and automatic offline fallback cache for remote journeys.
              </p>
            </div>
          </div>

          {/* 3. Accent Card in Sky Wash (#62aef0) */}
          <div className="rounded-[12px] p-6 bg-[#62aef0] text-[#000000] flex flex-col justify-between transition-transform hover:-translate-y-1">
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-full bg-[#ffffff] flex items-center justify-center text-[#000000] shadow-sm">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="text-xs uppercase tracking-wider font-bold text-[rgba(0,0,0,0.7)] block">
                Navigation
              </span>
              <h3 className="text-xl font-bold tracking-tight">
                Radius travel map
              </h3>
              <p className="text-sm font-normal text-[rgba(0,0,0,0.85)] leading-relaxed">
                Find curated dining, stays, and activities within 1 km or 2 km radius circles, complete with 1-click expense logging.
              </p>
            </div>
          </div>

          {/* 4. Accent Card in Coral (#f64932) */}
          <div className="rounded-[12px] p-6 bg-[#f64932] text-[#ffffff] flex flex-col justify-between transition-transform hover:-translate-y-1">
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-full bg-[#ffffff] flex items-center justify-center text-[#f64932] shadow-sm">
                <BellRing className="w-4 h-4" />
              </div>
              <span className="text-xs uppercase tracking-wider font-bold text-[rgba(255,255,255,0.8)] block">
                Urgency Alerts
              </span>
              <h3 className="text-xl font-bold tracking-tight">
                Proactive spend alerts
              </h3>
              <p className="text-sm font-normal text-[rgba(255,255,255,0.9)] leading-relaxed">
                Smart warnings fire before money depletes — triggers alerts when category spend exceeds 40% or remaining buffer drops below 20%.
              </p>
            </div>
          </div>

          {/* 5. White Feature Card */}
          <div className="rounded-[12px] p-6 bg-[#ffffff] border border-[rgba(0,0,0,0.08)] flex flex-col justify-between transition-transform hover:-translate-y-1">
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-full bg-[#e6f3fe] flex items-center justify-center text-[#0075de]">
                <MessageSquare className="w-4 h-4" />
              </div>
              <span className="text-xs uppercase tracking-wider font-semibold text-[#757575] block">
                Communication
              </span>
              <h3 className="text-xl font-bold text-[#000000] tracking-tight">
                1-Click WhatsApp settlements
              </h3>
              <p className="text-sm text-[#615d59] leading-relaxed">
                Pre-composed WhatsApp messages sent in 1 tap, detailing exact debt amounts, currency figures, and payee UPI IDs.
              </p>
            </div>
          </div>

          {/* 6. Dark Card Surface in Midnight Ink (#02093a) */}
          <div className="rounded-[12px] p-6 bg-[#02093a] text-[#ffffff] flex flex-col justify-between transition-transform hover:-translate-y-1">
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-full bg-[#ffffff] flex items-center justify-center text-[#02093a] shadow-sm">
                <QrCode className="w-4 h-4" />
              </div>
              <span className="text-xs uppercase tracking-wider font-bold text-[#62aef0] block">
                Instant UPI
              </span>
              <h3 className="text-xl font-bold tracking-tight">
                NPCI UPI QR generator
              </h3>
              <p className="text-sm font-normal text-[rgba(255,255,255,0.85)] leading-relaxed">
                Generate and scan instant scannable UPI QR codes directly inside the settlement ledger for zero-friction debt clearing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
