import React from 'react';
import { CalendarPlus, Receipt, HandCoins, ArrowRight } from 'lucide-react';

interface HowItWorksProps {
  onGetStarted: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onGetStarted }) => {
  const steps = [
    {
      step: '01',
      icon: CalendarPlus,
      title: 'Create Your Trip & Add Crew',
      description: 'Set your destination, dates, budget in INR/EUR/USD, and invite travel companions with their WhatsApp numbers.',
    },
    {
      step: '02',
      icon: Receipt,
      title: 'Log Shared Expenses On-The-Fly',
      description: 'Record food, stays, activities, and transport. Tag who paid and choose equal or custom split shares.',
    },
    {
      step: '03',
      icon: HandCoins,
      title: 'Settle in 1 Click via UPI or WhatsApp',
      description: 'Our engine minimizes cross-debts. Tap to launch WhatsApp messages or scan instant UPI QR codes to settle debts clean.',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600">
            Frictionless Flow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How TripMate Works
          </h2>
          <p className="text-base text-slate-600">
            From arrival to settlement, manage your group funds in three effortless steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100/70 text-emerald-700 flex items-center justify-center font-bold">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-black text-slate-200">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA Bar */}
        <div className="mt-16 text-center">
          <button
            onClick={onGetStarted}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Ready to Plan Your Next Adventure?</span>
            <ArrowRight className="w-4 h-4 text-emerald-400" />
          </button>
        </div>
      </div>
    </section>
  );
};
