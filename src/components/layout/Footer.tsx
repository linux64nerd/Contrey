import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#f6f5f4] border-t border-[rgba(0,0,0,0.08)] py-16 text-[#000000]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo & Note */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-[5px] bg-[#000000] text-[#ffffff] flex items-center justify-center font-bold text-xs">
                C
              </div>
              <span className="font-semibold text-lg tracking-tight">Contrey</span>
            </div>
            <p className="text-sm text-[#615d59] max-w-sm font-normal leading-relaxed">
              Warm paper notebook for group travel expenses. Minimum-transaction debt resolution, multi-currency live conversions, and map recommendations.
            </p>
          </div>

          {/* Product links */}
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#757575]">
              Product
            </span>
            <ul className="space-y-2 text-sm text-[#615d59]">
              <li>
                <Link to="/dashboard" className="hover:text-[#000000] transition-colors">
                  Overview & Analytics
                </Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-[#000000] transition-colors">
                  Travel Map
                </Link>
              </li>
              <li>
                <a href="#features" className="hover:text-[#000000] transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-[#000000] transition-colors">
                  How It Works
                </a>
              </li>
            </ul>
          </div>

          {/* Settlement Features */}
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#757575]">
              Financial Tools
            </span>
            <ul className="space-y-2 text-sm text-[#615d59]">
              <li>Greedy Debt Minimizer</li>
              <li>Multi-Currency Live FX</li>
              <li>WhatsApp Deep Link</li>
              <li>NPCI UPI QR Code</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[rgba(0,0,0,0.08)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#757575]">
          <p>© {new Date().getFullYear()} Contrey. Warm paper notebook under afternoon sun.</p>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
