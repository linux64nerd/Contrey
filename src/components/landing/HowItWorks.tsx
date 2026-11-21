import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HowItWorksProps {
  onGetStarted: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onGetStarted }) => {
  const steps = [
    {
      num: '01',
      title: 'Create Your Trip Space',
      desc: 'Set your total budget, select your base currency (INR, EUR, or USD), and add your travel crew with phone numbers and UPI IDs.',
      gradient: 'from-[#4d49fc] to-[#28259d]',
    },
    {
      num: '02',
      title: 'Log Shared Expenses',
      desc: 'Record hotels, dinners, or car rentals on the go. Choose between fair equal splits or custom rupee/euro allocations.',
      gradient: 'from-violet-600 to-purple-700',
    },
    {
      num: '03',
      title: 'Settle in Minimal Payments',
      desc: 'Our greedy algorithm resolves all crew balances into the fewest possible transfers. Settle with 1-click UPI QR or WhatsApp reminders.',
      gradient: 'from-emerald-600 to-teal-700',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200/80 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300/60 dark:border-slate-700">
            Effortless Flow
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How Contrey Works
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Three simple steps from packing your bags to settling the last cent.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => {
            const staggerClass = `stagger-${idx + 1}`;
            return (
              <div
                key={idx}
                className={`contrey-card p-7 flex flex-col justify-between bg-white dark:bg-slate-900 relative overflow-hidden hover-lift animate-fade-in-up ${staggerClass} group`}
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${step.gradient} text-white flex items-center justify-center font-heading font-extrabold text-lg shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    {step.num}
                  </div>
                  <h3 className="font-heading text-xl font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-14 text-center animate-fade-in-up stagger-4">
          <button
            onClick={onGetStarted}
            className="btn-primary hover-lift interactive-press"
          >
            <span>Start Your Group Trip</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
};
