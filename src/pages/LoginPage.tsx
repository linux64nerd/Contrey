import React, { useState } from 'react';
import { PhoneOtpForm } from '../components/auth/PhoneOtpForm';
import { EmailPasswordForm } from '../components/auth/EmailPasswordForm';
import { GoogleAuthButton } from '../components/auth/GoogleAuthButton';
import { UserIdPasswordForm } from '../components/auth/UserIdPasswordForm';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { Phone, Mail, KeyRound, Sparkles, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LoginPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'phone' | 'email' | 'google' | 'userid'>('phone');
  const { quickDemoLogin } = useAuth();
  const { currentCurrency, setCurrency } = useCurrency();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#f6f5f4] text-[#000000] font-sans selection:bg-[#e6f3fe] selection:text-[#0075de]">
      {/* Top Bar */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-[rgba(0,0,0,0.08)] bg-[#ffffff]">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-6 h-6 rounded-[5px] bg-[#000000] text-[#ffffff] flex items-center justify-center font-bold text-xs">
            C
          </div>
          <span className="font-semibold text-base tracking-tight text-[#000000]">
            Contrey
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <select
            value={currentCurrency}
            onChange={(e) => setCurrency(e.target.value as any)}
            className="px-2.5 py-1 rounded-[6px] bg-[#f6f5f4] border border-[rgba(0,0,0,0.1)] text-xs font-medium text-[#000000] cursor-pointer focus:outline-none focus:border-[#0075de]"
          >
            <option value="INR">INR (₹)</option>
            <option value="EUR">EUR (€)</option>
            <option value="USD">USD ($)</option>
          </select>
          <Link
            to="/"
            className="text-xs text-[#757575] hover:text-[#000000] flex items-center gap-1 font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Home</span>
          </Link>
        </div>
      </header>

      {/* Auth Card Container */}
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md bg-[#ffffff] rounded-[12px] border border-[rgba(0,0,0,0.08)] shadow-[0_4px_12px_rgba(0,0,0,0.08)] p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-1">
            <span className="text-2xl block">📓</span>
            <h1 className="text-2xl font-bold text-[#000000] tracking-tight">
              Log in to your trip notebook
            </h1>
            <p className="text-xs text-[#757575]">
              Select from 4 secure authentication methods
            </p>
          </div>

          {/* 1-Click Demo Shortcut (Sticky-Note style) */}
          <div className="p-3.5 rounded-[8px] bg-[#e6f3fe] border border-[#0075de]/20 flex items-center justify-between gap-3 text-[#0075de]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0 text-[#0075de]" />
              <div>
                <p className="text-xs font-semibold text-[#0075de]">Instant Demo Traveler?</p>
                <p className="text-[11px] text-[#0075de]/80">Pre-loaded multi-currency trip</p>
              </div>
            </div>
            <button
              onClick={quickDemoLogin}
              className="px-3 py-1.5 rounded-[6px] bg-[#0075de] hover:bg-[#0066c0] text-[#ffffff] text-xs font-medium transition-all shrink-0"
            >
              Demo Log in →
            </button>
          </div>

          {/* 4 Method Selector Pills */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-[#f6f5f4] rounded-[8px] border border-[rgba(0,0,0,0.06)] text-xs font-medium">
            <button
              onClick={() => setActiveTab('phone')}
              className={`py-1.5 rounded-[6px] transition-all flex items-center justify-center gap-1 ${
                activeTab === 'phone'
                  ? 'bg-[#ffffff] text-[#000000] shadow-xs font-semibold'
                  : 'text-[#757575] hover:text-[#000000]'
              }`}
            >
              <Phone className="w-3 h-3" />
              <span>Phone</span>
            </button>
            <button
              onClick={() => setActiveTab('email')}
              className={`py-1.5 rounded-[6px] transition-all flex items-center justify-center gap-1 ${
                activeTab === 'email'
                  ? 'bg-[#ffffff] text-[#000000] shadow-xs font-semibold'
                  : 'text-[#757575] hover:text-[#000000]'
              }`}
            >
              <Mail className="w-3 h-3" />
              <span>Email</span>
            </button>
            <button
              onClick={() => setActiveTab('google')}
              className={`py-1.5 rounded-[6px] transition-all flex items-center justify-center gap-1 ${
                activeTab === 'google'
                  ? 'bg-[#ffffff] text-[#000000] shadow-xs font-semibold'
                  : 'text-[#757575] hover:text-[#000000]'
              }`}
            >
              <span>Google</span>
            </button>
            <button
              onClick={() => setActiveTab('userid')}
              className={`py-1.5 rounded-[6px] transition-all flex items-center justify-center gap-1 ${
                activeTab === 'userid'
                  ? 'bg-[#ffffff] text-[#000000] shadow-xs font-semibold'
                  : 'text-[#757575] hover:text-[#000000]'
              }`}
            >
              <KeyRound className="w-3 h-3" />
              <span>ID</span>
            </button>
          </div>

          {/* Form Content */}
          <div className="pt-1">
            {activeTab === 'phone' && <PhoneOtpForm />}
            {activeTab === 'email' && <EmailPasswordForm />}
            {activeTab === 'google' && <GoogleAuthButton />}
            {activeTab === 'userid' && <UserIdPasswordForm />}
          </div>
        </div>
      </main>

      {/* Footer Copy */}
      <footer className="py-4 text-center text-xs text-[#757575] border-t border-[rgba(0,0,0,0.08)] bg-[#ffffff]">
        © {new Date().getFullYear()} Contrey. Clean notebook-first travel management.
      </footer>
    </div>
  );
};
