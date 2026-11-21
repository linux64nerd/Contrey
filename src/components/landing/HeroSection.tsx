import React from 'react';
import { ArrowRight, Sparkles, Shield, Compass, RefreshCw } from 'lucide-react';
import { InteractivePreviewCard } from './InteractivePreviewCard';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
  // Row of Notion-style character marks (40px circles with 2px colored borders)
  const avatars = [
    { initial: '👩‍🦰', border: '#f64932', name: 'Aisha' },
    { initial: '👨‍🦱', border: '#097fe8', name: 'Rohan' },
    { initial: '🧕', border: '#ffb110', name: 'Sara' },
    { initial: '🧔', border: '#62aef0', name: 'Arjun' },
    { initial: '👩‍🎨', border: '#e89d01', name: 'Elena' },
    { initial: '👨‍💻', border: '#f64932', name: 'Dev' },
    { initial: '🧑‍🚀', border: '#097fe8', name: 'Liam' },
  ];

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-28 bg-[#f6f5f4] text-[#000000]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Avatar Character Mark Row */}
          <div className="flex items-center justify-center -space-x-2 pt-2 pb-1">
            {avatars.map((av, i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-full bg-[#ffffff] flex items-center justify-center text-lg shadow-sm transition-transform hover:-translate-y-1"
                style={{ border: `2px solid ${av.border}` }}
                title={av.name}
              >
                <span>{av.initial}</span>
              </div>
            ))}
          </div>

          {/* Large Two-line Headline with Embedded Hero Highlight Pill */}
          <h1 className="text-4xl sm:text-6xl lg:text-[72px] font-bold text-[#000000] tracking-[-1.5px] sm:tracking-[-2.016px] leading-[1.08]">
            Where travel crews and friends{' '}
            <span className="inline-block bg-[#ffb110] text-[#000000] px-4 py-0.5 sm:px-6 sm:py-1 rounded-full font-semibold mx-1 shadow-xs transform -rotate-1">
              Settle
            </span>{' '}
            together.
          </h1>

          {/* Editorial Subhead in Lyon Text / Source Serif at 18px */}
          <p className="font-serif text-[18px] sm:text-[20px] text-[#615d59] max-w-2xl mx-auto leading-[1.56]">
            A warm, notebook-style workspace for group expenses. Settle multi-currency trip debts with greedy minimal transactions and explore spots on interactive maps.
          </p>

          {/* Two-Button CTA Row: Primary Blue (#0075de) + Ghost Sky Tint (#e6f3fe) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-5 py-2.5 rounded-[8px] bg-[#0075de] hover:bg-[#0066c0] text-[#ffffff] text-sm font-medium transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <span>Get Contrey free</span>
              <ArrowRight className="w-4 h-4 text-[#ffffff]" />
            </button>

            <a
              href="#preview"
              className="w-full sm:w-auto px-5 py-2.5 rounded-[8px] bg-[#e6f3fe] hover:bg-[#d6ecfd] text-[#0075de] text-sm font-medium transition-all flex items-center justify-center gap-2"
            >
              <span>Try live preview</span>
            </a>
          </div>

          {/* Greyscale Logo Wall / Trust Marks */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-8 text-xs text-[#757575] font-medium">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-[#757575]" />
              <span>Greedy Debt Minimizer</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#757575]" />
              <span>Live FX: INR • EUR • USD</span>
            </div>
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#757575]" />
              <span>Radius Travel Map</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#757575]" />
              <span>4-Method Authentication</span>
            </div>
          </div>
        </div>

        {/* Embedded Product UI Mockup (with drop shadow 0 4px 12px) */}
        <div id="preview" className="mt-14 max-w-4xl mx-auto">
          <InteractivePreviewCard />
        </div>
      </div>
    </section>
  );
};
