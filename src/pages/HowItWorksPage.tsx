import React, { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { InteractivePreviewCard } from '../components/landing/InteractivePreviewCard';
import { useAuth } from '../context/AuthContext';
import {
  ArrowRight,
  Plane,
  Receipt,
  QrCode,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const HowItWorksPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const steps = [
    {
      num: '01',
      title: 'Create Your Shared Trip Space',
      subtitle: 'Set budget, destination anchor, and crew roster',
      icon: Plane,
      gradient: 'from-[#4d49fc] to-[#28259d]',
      bullets: [
        'Define total target budget (e.g. ₹60,000 or €2,500) and base ledger currency.',
        'Set your destination anchor (Goa, Bali, Paris, Tokyo, etc.) for local radar discovery.',
        'Add up to 25 travel crew members with phone numbers & UPI IDs for instant payouts.',
      ],
    },
    {
      num: '02',
      title: 'Log Expenses & Fair Splits on the Go',
      subtitle: 'Record group transactions with zero mathematical drift',
      icon: Receipt,
      gradient: 'from-violet-600 to-purple-700',
      bullets: [
        'Track hotels, dinners, car rentals, and activities in any currency.',
        'Choose between fair equal splits or custom rupee/euro allocations per person.',
        'Real-time FX conversions equalize all entries into your trip base currency automatically.',
      ],
    },
    {
      num: '03',
      title: 'Settle Debts in Minimal Transactions',
      subtitle: 'Greedy minimization, instant UPI QR, and WhatsApp links',
      icon: QrCode,
      gradient: 'from-emerald-600 to-teal-700',
      bullets: [
        'Greedy optimization calculates the fewest direct transfers to square all debts.',
        'Scan generated NPCI UPI QR codes directly with GPay, PhonePe, or Paytm.',
        'Send pre-formatted polite WhatsApp reminders with breakdown details in 1 click.',
      ],
    },
  ];

  const faqs = [
    {
      q: 'How does the Greedy Debt Minimizer actually work?',
      a: 'Instead of having everyone settle with everyone individually (which creates circular, confusing transfers), our engine calculates the net balance for each person. Travelers with negative balances (debtors) are matched greedily with travelers holding positive balances (creditors) starting with the largest amounts. This guarantees conservation of funds while reducing transfer count by up to 70%.',
    },
    {
      q: 'What if someone in our group does not use UPI?',
      a: 'UPI QR generation is optional! Contrey also provides generic reference links, exact amount breakdowns, and customizable WhatsApp reminders so travelers can settle via bank transfer, Revolut, PayPal, cash, or credit transfer.',
    },
    {
      q: 'Does Contrey work offline during remote travels or flights?',
      a: 'Yes! All trip spaces, member rosters, and expenses are saved locally in client-side storage, and European Central Bank FX rates are cached for 24 hours. You can log expenses completely offline and sync whenever connected.',
    },
    {
      q: 'How does the 1–2 km Travel Radar work without an API key?',
      a: 'We use the world-standard OpenStreetMap engine with customized, lightweight client-side geolocation and bounding math. It delivers instant, zero-watermark curated spots for any destination on Earth completely free.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-100 selection:text-indigo-900 transition-colors duration-200">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-16 md:pt-16 md:pb-24 border-b border-slate-200/80 dark:border-slate-800">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-64 bg-gradient-to-b from-[#4d49fc]/10 via-[#c4baff]/5 to-transparent dark:from-[#4d49fc]/15 dark:via-transparent blur-xl pointer-events-none -z-10" />

          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900/60 text-xs font-semibold text-indigo-700 dark:text-indigo-300 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Step-by-Step Practical Walkthrough</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight max-w-3xl mx-auto leading-tight">
              Three Simple Steps from Packing Bags to Squaring the Last Cent
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Say goodbye to awkward post-trip IOUs and messy group spreadsheets. Here is how Contrey guarantees total financial harmony for your crew.
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
                  <span>Create Free Trip Space</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              <Link
                to="/features"
                className="btn-secondary hover-lift-sm interactive-press"
              >
                <span>Explore Technical Features</span>
              </Link>
            </div>
          </div>
        </section>

        {/* 3 Detailed Steps */}
        <section className="py-20 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="contrey-card p-8 sm:p-10 dark:bg-slate-900 dark:border-slate-800 hover-lift grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                <div className="lg:col-span-3 text-center lg:text-left space-y-3">
                  <div className={`w-16 h-16 rounded-3xl bg-gradient-to-tr ${step.gradient} text-white flex items-center justify-center font-heading font-extrabold text-2xl shadow-lg mx-auto lg:mx-0`}>
                    {step.num}
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
                    <Icon className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>Phase {step.num}</span>
                  </div>
                </div>

                <div className="lg:col-span-9 space-y-4">
                  <div>
                    <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mt-1">
                      {step.subtitle}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    {step.bullets.map((b, bIdx) => (
                      <div
                        key={bIdx}
                        className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 space-y-2"
                      >
                        <div className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                          {bIdx + 1}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                          {b}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* Interactive Simulator Section */}
        <section className="py-16 bg-slate-100/60 dark:bg-slate-900/40 border-t border-slate-200/80 dark:border-slate-800">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Live Simulator
              </span>
              <h3 className="font-heading text-3xl font-extrabold text-slate-900 dark:text-white">
                Simulate a Real Trip Split
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Experience how Contrey calculates real-time currency conversions, fair shares, and remaining budget capacity.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <InteractivePreviewCard />
            </div>
          </div>
        </section>

        {/* Frequently Asked Questions */}
        <section className="py-20 max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Clear Answers
            </span>
            <h3 className="font-heading text-3xl font-extrabold text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Everything you need to know about Contrey’s math, privacy, and payment flows.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="contrey-card overflow-hidden dark:bg-slate-900 dark:border-slate-800 transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <span className="font-heading font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                      {faq.q}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 animate-fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="pb-20 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-black text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden hover-lift border border-[#2a2a30]">
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#4d49fc]/25 rounded-full blur-3xl pointer-events-none" />
            <div className="space-y-2 text-center md:text-left z-10">
              <h3 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Ready to Organize Your Next Trip?
              </h3>
              <p className="text-slate-300 text-sm sm:text-base max-w-xl">
                Get started free today. Zero setup fees, zero credit card requirements.
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
                <span>Start Free Space</span>
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
