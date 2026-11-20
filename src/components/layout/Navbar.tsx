import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plane, 
  Compass, 
  Sparkles, 
  LogIn, 
  ChevronDown, 
  LogOut, 
  LayoutDashboard, 
  ShieldCheck
} from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { useAuth } from '../../context/AuthContext';
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

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-200/80 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
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
        </Link>

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
          {isAuthenticated && (
            <Link
              to="/dashboard"
              className="text-emerald-700 font-semibold flex items-center gap-1 hover:text-emerald-800 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
          )}
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

          {/* Authenticated State vs Guest State */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 p-1 pl-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all shadow-sm"
              >
                <div className="text-left hidden sm:block">
                  <span className="text-xs font-bold text-slate-800 block leading-tight">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wide">
                    {user.authMethod}
                  </span>
                </div>
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                  alt={user.name}
                  className="w-8 h-8 rounded-lg object-cover bg-emerald-100 border border-emerald-200"
                />
              </button>

              {/* Profile Dropdown */}
              {isProfileMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsProfileMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {user.email || user.phone || `@${user.id}`}
                      </p>
                      <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-[10px] font-semibold text-emerald-700 border border-emerald-100">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Verified via {user.authMethod.toUpperCase()}</span>
                      </div>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/dashboard"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="w-full px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                        <span>Travel Dashboard</span>
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          logout();
                          navigate('/');
                        }}
                        className="w-full px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              {/* Login Modal Action */}
              <button
                onClick={handleSignInClick}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>

              <button
                onClick={() => navigate('/login')}
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-semibold shadow-sm shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Get Started</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
