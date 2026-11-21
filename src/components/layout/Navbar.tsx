import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Compass,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  ArrowRight,
  Home,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { useAuth } from '../../context/AuthContext';
import { NotificationCenter } from '../notifications/NotificationCenter';
import { ThemeToggle } from '../common/ThemeToggle';
import { CurrencyCode } from '../../types/currency';

interface NavbarProps {
  onOpenAuth?: (initialMode?: 'phone' | 'email' | 'google' | 'userid') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth }) => {
  const { currentCurrency, setCurrency } = useCurrency();
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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

  const isPublicMarketingPage =
    location.pathname === '/home' ||
    location.pathname === '/features' ||
    location.pathname === '/how-it-works' ||
    (location.pathname === '/' && !isAuthenticated);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/85 dark:bg-slate-950/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo - links to /home if authenticated, or / */}
        <div className="flex items-center gap-8">
          <Link
            to={isAuthenticated ? '/home' : '/'}
            className="flex items-center gap-2.5 group"
            title="Contrey - Return to Homepage"
          >
            <div className="w-9 h-9 rounded-xl bg-[#4d49fc] text-white flex items-center justify-center font-bold text-base shadow-sm shadow-[#4d49fc]/30 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
              <span>C</span>
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-lg tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Contrey
              </span>
              <span className="text-[10px] -mt-1 font-medium text-slate-500 dark:text-slate-400 tracking-wide uppercase">
                Travel & Ledger
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            {/* Always accessible Home link so logged in users can view the homepage anytime! */}
            <Link
              to="/home"
              className={`px-3 py-1.5 rounded-lg transition-all hover-lift-sm ${
                location.pathname === '/home' || (location.pathname === '/' && !isAuthenticated)
                  ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Home
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className={`px-3 py-1.5 rounded-lg transition-all hover-lift-sm ${
                    location.pathname === '/dashboard' || (location.pathname === '/' && isAuthenticated)
                      ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/map"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all hover-lift-sm ${
                    location.pathname === '/map'
                      ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Compass className="w-4 h-4 text-indigo-500" />
                  <span>Travel Radar</span>
                </Link>
              </>
            )}

            {/* Dedicated Full Page for Features */}
            <Link
              to="/features"
              className={`px-3 py-1.5 rounded-lg transition-all hover-lift-sm ${
                location.pathname === '/features'
                  ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Features
            </Link>

            {/* Dedicated Full Page for How It Works */}
            <Link
              to="/how-it-works"
              className={`px-3 py-1.5 rounded-lg transition-all hover-lift-sm ${
                location.pathname === '/how-it-works' || location.pathname === '/guide'
                  ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              How It Works
            </Link>
          </nav>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Animated Light/Dark Mode Toggle */}
          <ThemeToggle />

          {/* Multi-Currency Dropdown */}
          <div className="relative">
            <select
              value={currentCurrency}
              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
              className="appearance-none pl-3 pr-7 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
          </div>

          {/* Notification Center Bell (when authenticated) */}
          {isAuthenticated && <NotificationCenter />}

          {/* Quick "Go to Dashboard" button when authenticated & viewing marketing pages */}
          {isAuthenticated && isPublicMarketingPage && (
            <Link
              to="/dashboard"
              className="hidden sm:inline-flex btn-primary !py-1.5 !px-3.5 !text-xs !rounded-xl hover-lift-sm interactive-press"
              title="Return to your active trip space"
            >
              <span>Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}

          {/* Auth State */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover-lift-sm interactive-press"
              >
                <div className="w-7 h-7 rounded-lg bg-[#4d49fc] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  {displayInitial}
                </div>
                <span className="hidden sm:inline text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[100px] truncate">
                  {displayName}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              </button>

              {/* Profile Dropdown */}
              {isProfileMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsProfileMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200/90 dark:border-slate-800 py-1.5 z-50 animate-fade-in-down">
                    <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                        {displayName}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {user?.email || user?.phone || user?.id || 'Signed in'}
                      </p>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                      <span>Trip Dashboard</span>
                    </Link>

                    <Link
                      to="/home"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      <Home className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                      <span>View Homepage</span>
                    </Link>

                    <Link
                      to="/map"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      <Compass className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                      <span>Travel Radar Map</span>
                    </Link>

                    <Link
                      to="/features"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                      <span>Features Full Page</span>
                    </Link>

                    <Link
                      to="/how-it-works"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                      <span>How It Works Guide</span>
                    </Link>

                    <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        logout();
                        navigate('/');
                      }}
                      className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors text-left font-medium"
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
              <button
                onClick={handleSignInClick}
                className="hidden sm:inline-flex px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all hover-lift-sm"
              >
                Sign In
              </button>
              <button
                onClick={handleSignInClick}
                className="btn-primary !py-1.5 !px-3.5 !text-xs !rounded-xl hover-lift-sm interactive-press"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
