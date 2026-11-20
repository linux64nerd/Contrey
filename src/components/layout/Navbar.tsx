import React from 'react';
import { Plane, Compass, Sparkles, LogIn, ChevronDown } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { CurrencyCode } from '../../types/currency';

interface NavbarProps {
  onOpenAuth?: (initialMode?: 'login' | 'signup') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth }) => {
  const { currentCurrency, setCurrency } = useCurrency();

  const currencies: { code: CurrencyCode; label: string; symbol: string }[] = [
    { code: 'INR', label: 'INR (₹)', symbol: '₹' },
    { code: 'EUR', label: 'EUR (€)', symbol: '€' },
    { code: 'USD', label: 'USD ($)', symbol: '$' },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-200/80 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Plane className="w-5 h-5 -rotate-45" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                Con<span className="text-emerald-600">trey</span>
              </span>
            </div>
            <p className="text-[10px] text-slate-500 tracking-wide font-medium hidden sm:block">
              Travel Smart, Spend Smart
            </p>
          </div>
        </a>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#features" className="hover:text-emerald-600 transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-emerald-600 transition-colors">
            How It Works
          </a>
          <a href="#calculator-preview" className="hover:text-emerald-600 transition-colors">
            Live Preview
          </a>
        </nav>

        {/* Right Action Group */}
        <div className="flex items-center gap-3">
          {/* Currency Selector */}
          <div className="relative group">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100/90 border border-slate-200 text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-200/70 transition-colors">
              <Compass className="w-3.5 h-3.5 text-emerald-600" />
              <span>{currentCurrency}</span>
              <ChevronDown className="w-3 h-3 text-slate-400 group-hover:rotate-180 transition-transform duration-200" />
            </div>

            <div className="absolute right-0 mt-1 w-32 bg-white rounded-xl shadow-xl border border-slate-100 py-1 hidden group-hover:block transition-all animate-in fade-in slide-in-from-top-1 z-50">
              {currencies.map((curr) => (
                <button
                  key={curr.code}
                  onClick={() => setCurrency(curr.code)}
                  className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between hover:bg-emerald-50 transition-colors ${
                    currentCurrency === curr.code
                      ? 'text-emerald-700 font-bold bg-emerald-50/60'
                      : 'text-slate-600'
                  }`}
                >
                  <span>{curr.label}</span>
                  <span className="text-slate-400">{curr.symbol}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Auth Action */}
          <button
            onClick={() => onOpenAuth ? onOpenAuth('login') : (window.location.href = '/login')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>

          <button
            onClick={() => onOpenAuth ? onOpenAuth('signup') : (window.location.href = '/login')}
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-semibold shadow-sm shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Get Started</span>
          </button>
        </div>
      </div>
    </header>
  );
};
