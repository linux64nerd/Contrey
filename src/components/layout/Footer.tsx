import React from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800 py-16 text-slate-600 dark:text-slate-400 transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo & Note */}
          <div className="md:col-span-2 space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#4d49fc] text-white flex items-center justify-center font-bold text-sm shadow-xs shadow-[#4d49fc]/25">
                C
              </div>
              <span className="font-heading font-bold text-lg tracking-tight text-slate-900 dark:text-white">
                Contrey
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm font-normal leading-relaxed">
              Effortless group travel ledgers and minimal-debt resolution. Split expenses with exact penny conservation, convert live currencies, and discover curated local spots.
            </p>
            <div className="flex items-center gap-3 pt-1 text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
              <span className="flex items-center gap-1">
                <RefreshCw className="w-3.5 h-3.5" /> Greedy Math Engine
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" /> 100% Client-Side Privacy
              </span>
            </div>
          </div>

          {/* Product links */}
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-wider font-bold text-slate-900 dark:text-slate-200">
              Navigation
            </span>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Dashboard & Ledger
                </Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Travel Radar Map
                </Link>
              </li>
              <li>
                <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Smart Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  How It Works
                </a>
              </li>
            </ul>
          </div>

          {/* Financial Tools */}
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-wider font-bold text-slate-900 dark:text-slate-200">
              Financial Engine
            </span>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Greedy Debt Minimizer</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <span>Multi-Currency Live FX</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>WhatsApp Settlement Link</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                <span>Instant NPCI UPI QR Codes</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 dark:text-slate-500 font-medium">
          <p>© {new Date().getFullYear()} Contrey. Built for seamless travel crews worldwide.</p>
          <div className="flex items-center gap-6 text-slate-500 dark:text-slate-400">
            <span className="hover:text-slate-900 dark:hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-900 dark:hover:text-white cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-900 dark:hover:text-white cursor-pointer">Security Protocol</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
