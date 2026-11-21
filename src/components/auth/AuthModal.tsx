import React, { useState, useEffect } from 'react';
import { PhoneOtpForm } from './PhoneOtpForm';
import { EmailPasswordForm } from './EmailPasswordForm';
import { GoogleAuthButton } from './GoogleAuthButton';
import { UserIdPasswordForm } from './UserIdPasswordForm';
import { useAuth } from '../../context/AuthContext';
import { X, Phone, Mail, KeyRound, Sparkles } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'phone' | 'email' | 'google' | 'userid';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'phone',
}) => {
  const [activeTab, setActiveTab] = useState<'phone' | 'email' | 'google' | 'userid'>(defaultTab);
  const { quickDemoLogin } = useAuth();

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-[#ffffff] rounded-[12px] border border-[rgba(0,0,0,0.08)] shadow-[0_4px_16px_rgba(0,0,0,0.15)] p-6 sm:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 rounded-[6px] hover:bg-[#f6f5f4] text-[#757575] hover:text-[#000000] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1">
          <span className="text-2xl block">📓</span>
          <h2 className="text-2xl font-bold text-[#000000] tracking-tight">
            Log in to Contrey
          </h2>
          <p className="text-xs text-[#757575]">
            Choose your preferred sign-in method
          </p>
        </div>

        {/* 1-Click Demo Shortcut */}
        <div className="p-3.5 rounded-[8px] bg-[#e6f3fe] border border-[#0075de]/20 flex items-center justify-between gap-3 text-[#0075de]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#0075de] shrink-0" />
            <div>
              <p className="text-xs font-semibold text-[#0075de]">Quick Evaluation?</p>
              <p className="text-[11px] text-[#0075de]/80">Skip form with 1-click demo</p>
            </div>
          </div>
          <button
            onClick={() => {
              quickDemoLogin();
              onClose();
            }}
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

        {/* Form Body */}
        <div className="pt-1">
          {activeTab === 'phone' && <PhoneOtpForm onSuccess={onClose} />}
          {activeTab === 'email' && <EmailPasswordForm onSuccess={onClose} />}
          {activeTab === 'google' && <GoogleAuthButton onSuccess={onClose} />}
          {activeTab === 'userid' && <UserIdPasswordForm onSuccess={onClose} />}
        </div>
      </div>
    </div>
  );
};
