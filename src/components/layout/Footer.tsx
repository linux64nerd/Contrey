import React from 'react';
import { Plane, Heart, Shield, Sparkles, Github } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Plane className="w-4 h-4 -rotate-45" />
              </div>
              <span className="font-extrabold text-lg text-white">
                Con<span className="text-emerald-400">trey</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Travel Smart, Spend Smart. The modern group travel expense management platform with real-time multi-currency conversion, minimal cash settlement algorithms, and urgency spend alerts.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 text-xs text-emerald-400 border border-slate-700">
                <Shield className="w-3.5 h-3.5" /> Zero Friction Open Source
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 text-xs text-teal-400 border border-slate-700">
                <Sparkles className="w-3.5 h-3.5" /> UPI & WhatsApp Ready
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-3">Product Highlights</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#features" className="hover:text-white transition-colors">Smart Expense Splitter</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Multi-Currency (INR/EUR/USD)</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Interactive Travel Map</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Urgency Spend Reminders</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Instant QR Payments</a></li>
            </ul>
          </div>

          {/* Supported Currencies */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-3">Global Currencies</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <span className="w-5 text-center font-bold text-emerald-400">₹</span>
                <span>Indian Rupee (INR)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 text-center font-bold text-blue-400">€</span>
                <span>Euro (EUR)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 text-center font-bold text-amber-400">$</span>
                <span>US Dollar (USD)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="flex items-center gap-1 text-slate-500">
            © {new Date().getFullYear()} Contrey. Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for travelers worldwide.
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Github className="w-4 h-4" /> GitHub Repository
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
