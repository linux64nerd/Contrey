import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Plane, Phone, Mail, Globe, UserCheck, Sparkles, ArrowLeft, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { PhoneOtpForm } from '../components/auth/PhoneOtpForm';
import { EmailPasswordForm } from '../components/auth/EmailPasswordForm';
import { GoogleAuthButton } from '../components/auth/GoogleAuthButton';
import { UserIdPasswordForm } from '../components/auth/UserIdPasswordForm';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, quickDemoLogin } = useAuth();
  const { currentCurrency, setCurrency } = useCurrency();

  const [activeTab, setActiveTab] = useState<'phone' | 'email' | 'google' | 'userid'>('phone');

  // Where to redirect after login
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSuccess = () => {
    navigate(from, { replace: true });
  };

  const tabs = [
    { id: 'phone' as const, label: 'Phone + OTP', icon: Phone },
    { id: 'email' as const, label: 'Email ID', icon: Mail },
    { id: 'google' as const, label: 'Google', icon: Globe },
    { id: 'userid' as const, label: 'User ID', icon: UserCheck },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Top Header */}
      <header className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Plane className="w-5 h-5 -rotate-45" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-slate-900">
            Con<span className="text-emerald-600">trey</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {/* Quick Currency Picker */}
          <div className="flex items-center gap-1 bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-700">
            <span>Currency:</span>
            <select
              value={currentCurrency}
              onChange={(e) => setCurrency(e.target.value as any)}
              className="bg-transparent font-bold text-emerald-700 focus:outline-none cursor-pointer"
            >
              <option value="INR">INR (₹)</option>
              <option value="EUR">EUR (€)</option>
              <option value="USD">USD ($)</option>
            </select>
          </div>

          <Link
            to="/"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Main Content Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">
          {/* Hero Banner */}
          <div className="px-6 pt-6 pb-5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-semibold text-emerald-100 mb-2">
              <Shield className="w-3 h-3" />
              <span>Mandatory Authentication Gate</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight">Sign In to Contrey</h1>
            <p className="text-xs text-emerald-100 mt-1 font-medium">
              Choose your preferred login method to access your trips and settlements.
            </p>
          </div>

          {/* 4 Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50 p-1.5 gap-1 text-xs font-semibold">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-2 px-1 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                    isActive
                      ? 'bg-white text-emerald-700 shadow-sm font-bold border border-slate-200/60'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Form Content */}
          <div className="p-6">
            {activeTab === 'phone' && <PhoneOtpForm onSuccess={handleSuccess} />}
            {activeTab === 'email' && <EmailPasswordForm onSuccess={handleSuccess} />}
            {activeTab === 'google' && <GoogleAuthButton onSuccess={handleSuccess} />}
            {activeTab === 'userid' && <UserIdPasswordForm onSuccess={handleSuccess} />}

            {/* Demo Quick Login Helper */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-950 block">Instant Testing?</span>
                  <span className="text-[11px] text-emerald-800">Bypass manual typing in 1 click</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    quickDemoLogin();
                    handleSuccess();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Demo Login</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Contrey. Travel Smart, Spend Smart.
      </footer>
    </div>
  );
};
