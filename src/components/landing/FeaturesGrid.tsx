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
  const features = [
    {
      icon: RefreshCw,
      badge: 'Algorithm',
      badgeColor: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200/60 dark:border-indigo-800',
      iconColor: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400',
      title: 'Greedy Debt Minimizer',
      desc: 'Condenses complex multi-person group debts into the absolute minimum number of payments. Eliminates tedious circular bank transfers.',
    },
    {
      icon: Coins,
      badge: 'Multi-Currency',
      badgeColor: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800',
      iconColor: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400',
      title: 'Real-Time FX Conversions',
      desc: 'Switch between INR, EUR, and USD instantly with live ECB rates and automatic offline fallback cache for remote excursions.',
    },
    {
      icon: MapPin,
      badge: 'Radar Map',
      badgeColor: 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200/60 dark:border-sky-800',
      iconColor: 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400',
      title: '1–2 km Radius Radar',
      desc: 'Explore curated dining, stays, and activities around your destination anchor, complete with instant 1-click expense logging.',
    },
    {
      icon: BellRing,
      badge: 'Smart Alerts',
      badgeColor: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200/60 dark:border-amber-800',
      iconColor: 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400',
      title: 'Proactive Spend Warnings',
      desc: 'Automated warnings notify you when category spending exceeds 40% or remaining buffer drops below 20%, keeping your trip solvent.',
    },
    {
      icon: QrCode,
      badge: 'Instant QR',
      badgeColor: 'bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border-violet-200/60 dark:border-violet-800',
      iconColor: 'bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400',
      title: 'NPCI UPI & Payment QR',
      desc: 'Generate scannable UPI QR codes formatted with exact amounts and clean payee handles. Pay directly with GPay, PhonePe, or Paytm.',
    },
    {
      icon: MessageSquare,
      badge: 'One-Click Share',
      badgeColor: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800',
      iconColor: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400',
      title: 'WhatsApp Deep Links',
      desc: 'Send pre-composed, polite settlement reminders with exact breakdown totals and recipient UPI IDs directly to group chats.',
    },
  ];

  return (
    <section id="features" className="py-24 bg-white dark:bg-slate-950 border-t border-slate-200/70 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800">
            Engineered For Travelers
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Designed for Simplicity. Built with Precision.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Everything your travel crew needs to track, visualize, and settle group expenses without friction.
          </p>
        </div>

        {/* 6 Modern Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="contrey-card p-6 sm:p-7 flex flex-col justify-between group hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${feat.iconColor} shadow-xs group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[11px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full border ${feat.badgeColor} transition-colors`}>
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="font-heading text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {feat.title}
                  </h3>

                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {feat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
