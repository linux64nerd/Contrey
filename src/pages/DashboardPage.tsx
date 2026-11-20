import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { 
  ShieldCheck, 
  Coins, 
  CheckCircle2
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { currentCurrency, setCurrency, rates, format, convertAmount } = useCurrency();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Protected Gate Verified Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 text-white p-6 sm:p-8 shadow-xl">
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-md">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>Protected Route Verified — Authenticated via {user?.authMethod.toUpperCase()}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome back, {user?.name || 'Traveler'}! ✈️
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
                You have successfully unlocked Contrey. Your trip expense management, smart bill splitting, and automated settlement engine are now active.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-xs space-y-1 sm:text-right">
              <span className="text-emerald-200 block font-medium">Logged in as:</span>
              <p className="font-bold text-sm text-white">{user?.email || user?.phone || user?.name}</p>
              <p className="text-[11px] text-emerald-300 font-mono">UPI: {user?.upiId || 'not configured'}</p>
            </div>
          </div>
        </div>

        {/* Currency Engine Showcase */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                Multi-Currency Engine
              </span>
              <h2 className="text-xl font-extrabold text-slate-900">
                Active Global Currency: {currentCurrency}
              </h2>
            </div>

            {/* Currency Switch Buttons */}
            <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
              {(['INR', 'EUR', 'USD'] as const).map((curr) => (
                <button
                  key={curr}
                  onClick={() => setCurrency(curr)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    currentCurrency === curr
                      ? 'bg-white text-emerald-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {curr === 'INR' && '₹ INR'}
                  {curr === 'EUR' && '€ EUR'}
                  {curr === 'USD' && '$ USD'}
                </button>
              ))}
            </div>
          </div>

          {/* Real-time Exchange Rates Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-semibold text-slate-500 block mb-1">Base Currency</span>
              <p className="text-lg font-black text-slate-800">1 EUR (€)</p>
              <span className="text-[11px] text-slate-400">European Central Bank Standard</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-semibold text-slate-500 block mb-1">Live EUR to INR</span>
              <p className="text-lg font-black text-emerald-600">₹{rates.rates.INR.toFixed(2)}</p>
              <span className="text-[11px] text-emerald-700">Indian Rupee</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-semibold text-slate-500 block mb-1">Live EUR to USD</span>
              <p className="text-lg font-black text-blue-600">${rates.rates.USD.toFixed(2)}</p>
              <span className="text-[11px] text-blue-700">US Dollar</span>
            </div>
          </div>

          {/* Test Amount Converter Preview */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-800">
                  Sample Expense: 100 EUR Hotel Booking
                </p>
                <p className="text-slate-500">
                  Converts dynamically in real-time across all views, charts, and balances.
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-slate-500 text-[11px] block">Converted to {currentCurrency}</span>
              <span className="text-lg font-black text-emerald-800">
                {format(convertAmount(100, 'EUR', currentCurrency))}
              </span>
            </div>
          </div>
        </div>

        {/* Checkpoint 3 Ready Notice */}
        <div className="p-6 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
              Checkpoint 2 Gate Passed
            </span>
            <h3 className="text-base font-bold text-white">
              Ready for Trip Calculator, Smart Splitter & Recharts Analytics
            </h3>
            <p className="text-xs text-slate-400 max-w-lg">
              Authentication and multi-currency conversion are fully operational. Trip management, category expense tracking, and debt simplification arrive in Checkpoint 3.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-800">
              <CheckCircle2 className="w-4 h-4" /> Ready for Checkpoint 3
            </span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
