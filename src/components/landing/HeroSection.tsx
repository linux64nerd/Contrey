import React from 'react';
import { ArrowRight, Sparkles, Shield, Compass, RefreshCw } from 'lucide-react';
import { InteractivePreviewCard } from './InteractivePreviewCard';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
  const { isAuthenticated } = useAuth();
  const avatars = [
    { initial: '👩‍🦰', ring: 'ring-indigo-400', name: 'Aisha' },
    { initial: '👨‍🦱', ring: 'ring-violet-400', name: 'Rohan' },
    { initial: '🧕', ring: 'ring-emerald-400', name: 'Sara' },
    { initial: '🧔', ring: 'ring-sky-400', name: 'Arjun' },
    { initial: '👩‍🎨', ring: 'ring-amber-400', name: 'Elena' },
    { initial: '👨‍💻', ring: 'ring-rose-400', name: 'Dev' },
    { initial: '🧑‍🚀', ring: 'ring-indigo-400', name: 'Liam' },
  ];

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-28">
      {/* Ambient background glow - lightweight blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-64 bg-gradient-to-b from-[#4d49fc]/10 via-[#c4baff]/5 to-transparent dark:from-[#4d49fc]/15 dark:via-transparent blur-xl pointer-events-none -z-10" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Top Pill Announcement */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-xs hover:border-[#4d49fc] dark:hover:border-[#4d49fc] transition-colors cursor-default">
            <span className="flex h-2 w-2 rounded-full bg-[#4d49fc]" />
            <span>Next-Gen Travel Ledger & Debt Settlement</span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="text-slate-600 dark:text-slate-400 font-medium">Contrey 2.0</span>
          </div>

          {/* Large Headline */}
          <h1 className="font-heading text-4xl sm:text-6xl lg:text-[68px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1]">
            Where travel crews and friends{' '}
            <span className="text-[#4d49fc] underline decoration-[#4d49fc]/30 dark:decoration-[#4d49fc]/60 decoration-wavy decoration-2">
              Settle
            </span>{' '}
            effortlessly.
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Eliminate awkward IOUs and complex split spreadsheets. Contrey condenses group debts into minimal transactions, converts live currencies, and pinpoints curated travel spots.
          </p>

          {/* CTA Row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="btn-primary w-full sm:w-auto interactive-press"
              >
                <span>Go to Your Dashboard</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            ) : (
              <button
                onClick={onGetStarted}
                className="btn-primary w-full sm:w-auto interactive-press"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            )}

            <a
              href="#preview"
              className="btn-secondary w-full sm:w-auto interactive-press"
            >
              <span>Try Interactive Simulator</span>
            </a>
          </div>

          {/* Avatar Stack & Social Proof */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center -space-x-2">
              {avatars.map((av, i) => (
                <div
                  key={i}
                  className={`w-9 h-9 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-sm shadow-xs ring-2 ${av.ring} transition-transform hover:-translate-y-1 hover:z-10`}
                  title={av.name}
                >
                  <span>{av.initial}</span>
                </div>
              ))}
            </div>
            <span className="font-medium text-slate-600 dark:text-slate-300">
              Trusted by 10,000+ friends exploring Goa, Bali, Paris, Tokyo & beyond.
            </span>
          </div>

          {/* Key Value Badges */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs text-slate-500 dark:text-slate-400 font-semibold">
            <div className="flex items-center gap-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              <RefreshCw className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Greedy Debt Minimizer</span>
            </div>
            <div className="flex items-center gap-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Live FX: INR • EUR • USD</span>
            </div>
            <div className="flex items-center gap-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              <Compass className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>1–2 km Radius Radar</span>
            </div>
            <div className="flex items-center gap-2 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Exact Penny Conservation</span>
            </div>
          </div>
        </div>

        {/* Embedded Interactive Product UI Mockup */}
        <div id="preview" className="mt-14 max-w-4xl mx-auto">
          <div className="transition-all duration-200">
            <InteractivePreviewCard />
          </div>
        </div>
      </div>
    </section>
  );
};
