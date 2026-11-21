import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HowItWorksProps {
  onGetStarted: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onGetStarted }) => {
  const steps = [
    {
      num: '1',
      title: 'Create trip notebook',
      desc: 'Set your total budget, select base currency (INR, EUR, USD), and invite your crew with phones and UPI IDs.',
      color: '#0075de',
    },
    {
      num: '2',
      title: 'Log shared expenses',
      desc: 'Record meals, hotels, or cab rides in seconds with equal splits or custom rupee/euro allocations.',
      color: '#ffb110',
    },
    {
      num: '3',
      title: 'Settle minimal transfers',
      desc: 'Our greedy algorithm condenses all debts. Send pre-composed WhatsApp reminders or pay via instant UPI QR codes.',
      color: '#f64932',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-[#f6f5f4] text-[#000000]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#757575]">
            Simple 3-step loop
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#000000] tracking-[-1.89px]">
            How Contrey works
          </h2>
          <p className="font-serif text-[18px] text-[#615d59]">
            Three straightforward steps from landing to full settlement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div
              key={step.num}
              className="rounded-[12px] p-6 bg-[#ffffff] border border-[rgba(0,0,0,0.08)] flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-[#ffffff]"
                  style={{ backgroundColor: step.color }}
                >
                  {step.num}
                </div>
                <h3 className="text-lg font-bold text-[#000000] tracking-tight">
                  {step.title}
                </h3>
                <p className="text-sm text-[#615d59] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={onGetStarted}
            className="px-6 py-2.5 rounded-[8px] bg-[#0075de] hover:bg-[#0066c0] text-[#ffffff] text-sm font-medium transition-all shadow-xs inline-flex items-center gap-2"
          >
            <span>Start a trip notebook</span>
            <ArrowRight className="w-4 h-4 text-[#ffffff]" />
          </button>
        </div>
      </div>
    </section>
  );
};
