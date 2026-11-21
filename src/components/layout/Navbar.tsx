import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  ChevronDown,
  LogOut,
  LayoutDashboard
} from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { useAuth } from '../../context/AuthContext';
import { NotificationCenter } from '../notifications/NotificationCenter';
import { CurrencyCode } from '../../types/currency';

interface NavbarProps {
  onOpenAuth?: (initialMode?: 'phone' | 'email' | 'google' | 'userid') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth }) => {
  const { currentCurrency, setCurrency } = useCurrency();
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const navigate = useNavigate();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState<boolean>(false);

  const currencies: { code: CurrencyCode; label: string; symbol: string }[] = [
    { code: 'INR', label: 'INR (₹)', symbol: '₹' },
    { code: 'EUR', label: 'EUR (€)', symbol: '€' },
    { code: 'USD', label: 'USD ($)', symbol: '$' },
  ];

  const handleSignInClick = () => {
    if (onOpenAuth) {
      onOpenAuth('phone');
    } else {
      openAuthModal('phone');
    }
  };

  const displayName = user?.name || 'Traveler';
  const displayInitial = (displayName.charAt(0) || 'T').toUpperCase();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#f6f5f4]/95 backdrop-blur-sm border-b border-[rgba(0,0,0,0.08)] shadow-[0px_0.7px_1.462px_0px_rgba(0,0,0,0.015),0px_3px_9px_0px_rgba(0,0,0,0.03)] transition-all">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo in Notion Notebook Style */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-[6px] bg-[#000000] text-[#ffffff] flex items-center justify-center font-bold text-sm shadow-sm group-hover:bg-[#0075de] transition-colors">
              C
            </div>
            <span className="font-semibold text-lg tracking-tight text-[#000000]">
              Contrey
            </span>
          </Link>

          {/* Navigation Links (Muted 60% alpha text, darkens on hover, never underlines) */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link
              to="/dashboard"
              className="px-3 py-1.5 rounded-[8px] text-[rgba(0,0,0,0.60)] hover:text-[#000000] hover:bg-[rgba(0,0,0,0.04)] transition-all"
            >
              Dashboard
            </Link>
            <Link
              to="/map"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[rgba(0,0,0,0.60)] hover:text-[#000000] hover:bg-[rgba(0,0,0,0.04)] transition-all"
            >
              <Compass className="w-4 h-4 text-[#757575]" />
              <span>Travel Map</span>
            </Link>
            <a
              href="/#features"
              className="px-3 py-1.5 rounded-[8px] text-[rgba(0,0,0,0.60)] hover:text-[#000000] hover:bg-[rgba(0,0,0,0.04)] transition-all"
            >
              Features
            </a>
            <a
              href="/#how-it-works"
              className="px-3 py-1.5 rounded-[8px] text-[rgba(0,0,0,0.60)] hover:text-[#000000] hover:bg-[rgba(0,0,0,0.04)] transition-all"
            >
              How It Works
            </a>
          </nav>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-3">
          {/* Multi-Currency Dropdown */}
          <div className="relative">
            <select
              value={currentCurrency}
              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
              className="appearance-none pl-3 pr-7 py-1 rounded-[8px] bg-transparent hover:bg-[rgba(0,0,0,0.04)] border border-[rgba(0,0,0,0.12)] text-xs font-medium text-[#000000] cursor-pointer focus:outline-none focus:border-[#0075de] transition-all"
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#757575] absolute right-2 top-1.5 pointer-events-none" />
          </div>

          {/* In-App Notification Center */}
          <NotificationCenter />

          {/* User Auth Section */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 p-1 rounded-[8px] hover:bg-[rgba(0,0,0,0.05)] transition-colors"
              >
                <div className="w-7 h-7 rounded-[6px] bg-[#0075de] text-[#ffffff] flex items-center justify-center font-semibold text-xs">
                  {displayInitial}
                </div>
                <span className="text-xs font-medium text-[#000000] hidden sm:inline max-w-[100px] truncate">
                  {displayName}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#757575]" />
              </button>

              {/* Profile Dropdown */}
              {isProfileMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsProfileMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-[#ffffff] rounded-[12px] border border-[rgba(0,0,0,0.08)] shadow-[0_4px_12px_rgba(0,0,0,0.1)] z-20 py-2 animate-in fade-in slide-in-from-top-1">
                    <div className="px-4 py-2 border-b border-[rgba(0,0,0,0.08)]">
                      <p className="text-xs font-semibold text-[#000000] truncate">{displayName}</p>
                      <p className="text-[11px] text-[#757575] truncate">
                        {user.phone || user.email || user.id}
                      </p>
                      {user.upiId && (
                        <p className="text-[10px] text-[#0075de] font-mono truncate mt-0.5">
                          UPI: {user.upiId}
                        </p>
                      )}
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-[#615d59] hover:text-[#000000] hover:bg-[rgba(0,0,0,0.04)] transition-colors"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      <span>Trip Dashboard</span>
                    </Link>

                    <Link
                      to="/map"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-[#615d59] hover:text-[#000000] hover:bg-[rgba(0,0,0,0.04)] transition-colors"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>Travel Map</span>
                    </Link>

                    <div className="border-t border-[rgba(0,0,0,0.08)] my-1" />

                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-[#f64932] hover:bg-[#f64932]/10 transition-colors text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {/* Ghost Text Button */}
              <button
                onClick={handleSignInClick}
                className="px-3.5 py-1.5 rounded-[8px] text-xs font-medium text-[rgba(0,0,0,0.85)] hover:bg-[rgba(0,0,0,0.05)] transition-colors"
              >
                Log in
              </button>

              {/* Primary Notion Blue CTA Button */}
              <button
                onClick={() => onOpenAuth ? onOpenAuth('phone') : navigate('/login')}
                className="px-4 py-1.5 rounded-[8px] bg-[#0075de] hover:bg-[#0066c0] text-[#ffffff] text-xs font-medium transition-colors shadow-xs"
              >
                Get Contrey free
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
