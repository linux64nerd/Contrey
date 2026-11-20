import React, { useState } from 'react';
import { X, Phone, Mail, Globe, UserCheck, Sparkles, Plane } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PhoneOtpForm } from './PhoneOtpForm';
import { EmailPasswordForm } from './EmailPasswordForm';
import { GoogleAuthButton } from './GoogleAuthButton';
import { UserIdPasswordForm } from './UserIdPasswordForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'phone' | 'email' | 'google' | 'userid';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultTab = 'phone' }) => {
  const { quickDemoLogin } = useAuth();
  const [activeTab, setActiveTab] = useState<'phone' | 'email' | 'google' | 'userid'>(defaultTab);

  if (!isOpen) return null;

  const tabs = [
    { id: 'phone' as const, label: 'Phone + OTP', icon: Phone },
    { id: 'email' as const, label: 'Email', icon: Mail },
    { id: 'google' as const, label: 'Google', icon: Globe },
    { id: 'userid' as const, label: 'User ID', icon: UserCheck },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="relative px-6 pt-6 pb-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Plane className="w-4 h-4 -rotate-45 text-white" />
            </div>
            <span className="font-extrabold text-base tracking-tight">
              Contrey Authentication
            </span>
          </div>

          <p className="text-xs text-emerald-100 font-medium">
            Log in to manage trips, split bills, and unlock smart travel spend features.
          </p>
        </div>

        {/* Auth Method Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 p-1.5 gap-1 text-xs font-semibold">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 px-1.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
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

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'phone' && <PhoneOtpForm onSuccess={onClose} />}
          {activeTab === 'email' && <EmailPasswordForm onSuccess={onClose} />}
          {activeTab === 'google' && <GoogleAuthButton onSuccess={onClose} />}
          {activeTab === 'userid' && <UserIdPasswordForm onSuccess={onClose} />}

          {/* Quick Demo Helper */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">Need instant testing?</span>
            <button
              type="button"
              onClick={() => {
                quickDemoLogin();
                onClose();
              }}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>1-Click Demo Login</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
