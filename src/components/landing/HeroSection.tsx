import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { InteractivePreviewCard } from './InteractivePreviewCard';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
      {/* Background Glow Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-200/40 via-teal-100/30 to-sky-100/20 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline and Call to Actions */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-xs font-semibold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Travel Smart, Spend Smart</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              Master Group Expenses. <br />
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 bg-clip-text text-transparent">
                Settle Debts in Seconds.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Say goodbye to messy spreadsheets and awkward money chats. TripMate automatically converts currencies, calculates minimal transactions, guides your stay with nearby map recommendations, and alerts you before you overspend.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onGetStarted}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Start Planning Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#calculator-preview"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all hover:border-slate-300"
              >
                <span>Interactive Demo</span>
              </a>
            </div>

            {/* Quick Value Prop Highlights */}
            <div className="pt-6 border-t border-slate-200/70 grid grid-cols-3 gap-4 text-center lg:text-left">
              <div>
                <span className="text-2xl font-black text-slate-900 block">3</span>
                <span className="text-xs text-slate-500 font-medium">Currencies (INR, EUR, USD)</span>
              </div>
              <div>
                <span className="text-2xl font-black text-emerald-600 block">1-Click</span>
                <span className="text-xs text-slate-500 font-medium">UPI & WhatsApp Splits</span>
              </div>
              <div>
                <span className="text-2xl font-black text-slate-900 block">100%</span>
                <span className="text-xs text-slate-500 font-medium">Offline Fallback Ready</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive Preview Card */}
          <div id="calculator-preview" className="lg:col-span-6 w-full max-w-lg mx-auto lg:max-w-none">
            <InteractivePreviewCard />
          </div>
        </div>
      </div>
    </section>
  );
};
