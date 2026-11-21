import React, { useState, useEffect } from 'react';
import { PhoneOtpForm } from '../components/auth/PhoneOtpForm';
import { EmailPasswordForm } from '../components/auth/EmailPasswordForm';
import { GoogleAuthButton } from '../components/auth/GoogleAuthButton';
import { UserIdPasswordForm } from '../components/auth/UserIdPasswordForm';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { CurrencyCode } from '../types/currency';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { Phone, Mail, KeyRound, Sparkles, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const LoginPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'phone' | 'email' | 'google' | 'userid'>('phone');
  const { quickDemoLogin, isAuthenticated } = useAuth();
  const { currentCurrency, setCurrency } = useCurrency();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLoginSuccess = () => {
    navigate('/dashboard');
  };

  const handleDemoLogin = () => {
    quickDemoLogin();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-100 selection:text-indigo-900 transition-colors duration-300">
      {/* Top Bar */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-[#4d49fc] text-white flex items-center justify-center font-bold text-sm shadow-xs shadow-[#4d49fc]/25">
            C
          </div>
          <span className="font-heading font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
            Contrey
          </span>
        </Link>
        <div className="flex items-center gap-2.5 sm:gap-3">
          <ThemeToggle />
          <select
            value={currentCurrency}
            onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer focus:outline-none focus:border-indigo-500"
          >
            <option value="INR">INR (₹)</option>
            <option value="EUR">EUR (€)</option>
            <option value="USD">USD ($)</option>
          </select>
          <Link
            to="/"
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
        </div>
      </header>

      {/* Auth Card Container */}
      <main className="flex-1 flex items-center justify-center p-4 py-12 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 relative z-10 transition-colors">
          {/* Header */}
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto text-2xl shadow-xs">
              ✈️
            </div>
            <h1 className="font-heading text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight pt-2">
              Log in to Contrey
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select from 4 secure authentication channels
            </p>
          </div>

          {/* 1-Click Demo Shortcut */}
          <div className="p-3.5 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900 flex items-center justify-between gap-3 text-indigo-900 dark:text-indigo-200">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
              <div>
                <p className="text-xs font-bold text-indigo-900 dark:text-indigo-200">Instant Demo Traveler?</p>
                <p className="text-[11px] text-indigo-600/80 dark:text-indigo-400/80">Pre-loaded multi-currency trip</p>
              </div>
            </div>
            <button
              onClick={handleDemoLogin}
              className="btn-primary !py-1.5 !px-3 !text-xs !rounded-lg shrink-0"
            >
              Demo Sign In →
            </button>
          </div>

          {/* 4 Method Selector Pills */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold">
            <button
              onClick={() => setActiveTab('phone')}
              className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 ${
                activeTab === 'phone'
                  ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Phone className="w-3 h-3" />
              <span>Phone</span>
            </button>
            <button
              onClick={() => setActiveTab('email')}
              className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 ${
                activeTab === 'email'
                  ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Mail className="w-3 h-3" />
              <span>Email</span>
            </button>
            <button
              onClick={() => setActiveTab('google')}
              className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 ${
                activeTab === 'google'
                  ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>Google</span>
            </button>
            <button
              onClick={() => setActiveTab('userid')}
              className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 ${
                activeTab === 'userid'
                  ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <KeyRound className="w-3 h-3" />
              <span>ID</span>
            </button>
          </div>

          {/* Method Forms */}
          <div className="pt-1">
            {activeTab === 'phone' && <PhoneOtpForm onSuccess={handleLoginSuccess} />}
            {activeTab === 'email' && <EmailPasswordForm onSuccess={handleLoginSuccess} />}
            {activeTab === 'google' && <GoogleAuthButton onSuccess={handleLoginSuccess} />}
            {activeTab === 'userid' && <UserIdPasswordForm onSuccess={handleLoginSuccess} />}
          </div>

          {/* Security footnote */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>End-to-end encrypted client-side session storage</span>
          </div>
        </div>
      </main>

      <footer className="py-4 text-center text-xs text-slate-400 dark:text-slate-500 border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950">
        © {new Date().getFullYear()} Contrey. Group Travel & Ledger Platform.
      </footer>
    </div>
  );
};
