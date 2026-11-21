import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { InteractivePreviewCard } from '../components/landing/InteractivePreviewCard';
import { useAuth } from '../context/AuthContext';
import {
  RefreshCw,
  Coins,
  MapPin,
  MessageSquare,
  QrCode,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const FeaturesPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-100 selection:text-indigo-900 transition-colors duration-200">
      <Navbar />

      <main className="flex-1">
        {/* Hero Banner */}
        <section className="relative overflow-hidden pt-12 pb-16 md:pt-16 md:pb-24 border-b border-slate-200/80 dark:border-slate-800">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-64 bg-gradient-to-b from-[#4d49fc]/10 via-[#c4baff]/5 to-transparent dark:from-[#4d49fc]/15 dark:via-transparent blur-xl pointer-events-none -z-10" />

          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900/60 text-xs font-semibold text-indigo-700 dark:text-indigo-300 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Full System Architecture & Capabilities</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight max-w-3xl mx-auto leading-tight">
              Engineered for Mathematical Certainty & Group Travel Ease
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Explore the six core technical systems powering Contrey: from greedy debt minimization to real-time FX conversions and radius radar discovery.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="btn-primary hover-lift interactive-press"
                >
                  <span>Go to Your Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="btn-primary hover-lift interactive-press"
                >
                  <span>Start Free Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              <Link
                to="/how-it-works"
                className="btn-secondary hover-lift-sm interactive-press"
              >
                <span>Read How It Works Walkthrough</span>
              </Link>
            </div>
          </div>
        </section>

        {/* 6 Comprehensive In-Depth Feature Modules */}
        <section className="py-20 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Feature 1: Greedy Debt Minimizer */}
          <div className="contrey-card p-8 sm:p-10 dark:bg-slate-900 dark:border-slate-800 hover-lift grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800">
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Algorithm Core</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Greedy Debt Minimization Engine
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                When 6 friends travel together, settling round-robin expenses often results in 15+ confusing circular bank transfers. Contrey’s algorithmic settlement engine reduces this to the theoretical minimum number of transactions using greedy bipartite matching.
              </p>
              <div className="space-y-2 pt-2">
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Conservation of Funds:</strong> The sum of all net balances always equals exactly zero (sum of debts = sum of credits = 0.00).</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Zero Circular Transfers:</strong> Creditors with largest surplus are matched greedily with debtors holding greatest deficits.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Exact Penny Allocation:</strong> Fractional division remainders are cleanly bounded to avoid floating-point balance drift.</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
              <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 block">
                Greedy Resolution Example
              </span>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 flex justify-between items-center">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Rohit Mehta</span>
                  <span className="text-rose-600 dark:text-rose-400 font-mono font-bold">-₹1,400.00</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 flex justify-between items-center">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Vikram Singh</span>
                  <span className="text-rose-600 dark:text-rose-400 font-mono font-bold">-₹500.00</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 flex justify-between items-center">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Aisha Khan</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">+₹900.00</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 flex justify-between items-center">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Elena Rostova</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">+₹1,000.00</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs space-y-1">
                <span className="font-bold text-emerald-800 dark:text-emerald-300 block">
                  ⚡ Minimized to Just 2 Payments:
                </span>
                <p className="text-emerald-700 dark:text-emerald-400 leading-snug">
                  1. Rohit pays Elena <strong>₹1,000</strong><br />
                  2. Rohit pays Aisha <strong>₹400</strong> & Vikram pays Aisha <strong>₹500</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Feature 2: Multi-Currency Live FX */}
          <div className="contrey-card p-8 sm:p-10 dark:bg-slate-900 dark:border-slate-800 hover-lift grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
              <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 block">
                Supported Real-Time Currencies
              </span>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <span className="text-lg block mb-0.5">🇮🇳</span>
                  <span className="font-bold block text-slate-900 dark:text-white">INR</span>
                  <span className="text-slate-400 font-mono text-[10px]">₹ Rupee</span>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <span className="text-lg block mb-0.5">🇪🇺</span>
                  <span className="font-bold block text-slate-900 dark:text-white">EUR</span>
                  <span className="text-slate-400 font-mono text-[10px]">€ Euro</span>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <span className="text-lg block mb-0.5">🇺🇸</span>
                  <span className="font-bold block text-slate-900 dark:text-white">USD</span>
                  <span className="text-slate-400 font-mono text-[10px]">$ Dollar</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-800 dark:text-indigo-300">
                <span className="font-bold block mb-0.5">ECB Daily Feed & Offline Cache:</span>
                <span>Automatic 24h client-side caching ensures seamless conversion even while on flights or remote mountain treks.</span>
              </div>
            </div>

            <div className="lg:col-span-7 order-1 lg:order-2 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800">
                <Coins className="w-3.5 h-3.5" />
                <span>Multi-Currency FX</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Live Multi-Currency Conversions & Equalizer
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Traveling across borders? Log flights in USD, dinners in EUR, and local cabs in INR. Contrey instantly equalizes and converts all ledger figures into your trip’s base currency or active view preference in real time.
              </p>
              <div className="space-y-2 pt-2">
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>1-Click Currency Toggling:</strong> Instantly transform all dashboard charts and tables between INR, EUR, and USD.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Base Currency Anchor:</strong> Each trip defines its native accounting currency to preserve historical ledger integrity.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 3: 1-2 km Radar Map */}
          <div className="contrey-card p-8 sm:p-10 dark:bg-slate-900 dark:border-slate-800 hover-lift grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-50 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800">
                <MapPin className="w-3.5 h-3.5" />
                <span>Location Radar</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                1–2 km Destination Radar & Smart Recommendations
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Never wonder where to eat or stay next. Contrey anchors your trip location and projects curated dining, stays, shopping, and activities within a customizable 1 km or 2 km radius.
              </p>
              <div className="space-y-2 pt-2">
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>100% Free OpenStreetMap Integration:</strong> Zero API keys or watermarks required; complete international coverage.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>1-Click Expense Logging:</strong> Click any recommendation on the radar to instantly pre-fill a new expense card with title and price.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Adaptive Dark Matter Night Mode:</strong> Sleek inverted basemaps that blend with modern dark mode interfaces.</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center text-3xl mx-auto shadow-xs">
                🧭
              </div>
              <div>
                <h4 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
                  Interactive Travel Radar Map
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                  Pinpoint your trip anchor in Goa, Bali, Paris, or Tokyo and explore vetted venues.
                </p>
              </div>
              <Link
                to="/map"
                className="btn-secondary !py-2 !px-4 !text-xs !rounded-xl inline-flex items-center gap-1.5"
              >
                <span>Launch Travel Radar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Feature 4: NPCI UPI & WhatsApp Reminders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Instant QR */}
            <div className="contrey-card p-8 dark:bg-slate-900 dark:border-slate-800 hover-lift space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-violet-50 dark:bg-violet-950/80 text-violet-700 dark:text-violet-300 border border-violet-200/60 dark:border-violet-800">
                <QrCode className="w-3.5 h-3.5" />
                <span>NPCI Payments</span>
              </div>
              <h3 className="font-heading text-2xl font-bold text-slate-900 dark:text-white">
                Instant UPI Payment QR Codes
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Generate high-resolution scannable QR codes formatted with exact settlement amounts and clean payee handles. Pay directly with Google Pay, PhonePe, Paytm, or any UPI app.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 pt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Downloadable PNG pass for offline sharing</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Sanitized query parameters preventing injection bugs</span>
                </li>
              </ul>
            </div>

            {/* WhatsApp Deep Links */}
            <div className="contrey-card p-8 dark:bg-slate-900 dark:border-slate-800 hover-lift space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Instant Sharing</span>
              </div>
              <h3 className="font-heading text-2xl font-bold text-slate-900 dark:text-white">
                Polite WhatsApp Settlement Links
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Tired of awkward debt reminders? Contrey automatically writes courteous, detailed settlement summaries with breakdown totals and UPI handles sent straight to WhatsApp group chats.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 pt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Clean international phone number formatting (e.g. +91)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>1-click fallback to generic WhatsApp Web sharing</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Interactive Live Simulator Showcase */}
        <section className="py-16 bg-slate-100/60 dark:bg-slate-900/40 border-t border-slate-200/80 dark:border-slate-800">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Interactive Model
              </span>
              <h3 className="font-heading text-3xl font-extrabold text-slate-900 dark:text-white">
                Test the Math Before Your Journey
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Drag the sliders below to simulate group budgets, spend percentages, and per-traveler distributions in real time.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <InteractivePreviewCard />
            </div>
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="py-20 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-black text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden hover-lift border border-[#2a2a30]">
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#4d49fc]/25 rounded-full blur-3xl pointer-events-none" />
            <div className="space-y-2 text-center md:text-left z-10">
              <h3 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Experience Contrey’s Power Firsthand
              </h3>
              <p className="text-slate-300 text-sm sm:text-base max-w-xl">
                Ready to take control of your next crew trip? Create a shared trip space in under 30 seconds.
              </p>
            </div>
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="btn-primary !bg-white !text-indigo-900 hover:!bg-indigo-50 !py-3 !px-6 !text-sm !font-bold shrink-0 z-10 hover-lift interactive-press"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="btn-primary !bg-white !text-indigo-900 hover:!bg-indigo-50 !py-3 !px-6 !text-sm !font-bold shrink-0 z-10 hover-lift interactive-press"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
