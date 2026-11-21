import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { PhoneOtpForm } from './PhoneOtpForm';
import { EmailPasswordForm } from './EmailPasswordForm';
import { GoogleAuthButton } from './GoogleAuthButton';
import { UserIdPasswordForm } from './UserIdPasswordForm';
import { useAuth } from '../../context/AuthContext';
import { X, Phone, Mail, KeyRound, Sparkles, ShieldCheck } from 'lucide-react';

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

  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[100] flex min-h-screen items-center justify-center p-4 overflow-y-auto bg-slate-900/60 transition-opacity duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-md my-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 text-slate-900 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto text-xl shadow-xs">
            ✈️
          </div>
          <h2 className="font-heading text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight pt-1">
            Sign in to Contrey
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Choose your preferred sign-in method
          </p>
        </div>

        {/* 1-Click Demo Shortcut */}
        <div className="p-3.5 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900 flex items-center justify-between gap-3 text-indigo-900 dark:text-indigo-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-indigo-900 dark:text-indigo-200">Quick Evaluation?</p>
              <p className="text-[11px] text-indigo-600/80 dark:text-indigo-400/80">Skip form with 1-click demo</p>
            </div>
          </div>
          <button
            onClick={() => {
              quickDemoLogin();
              onClose();
            }}
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

        {/* Form Body */}
        <div>
          {activeTab === 'phone' && <PhoneOtpForm onSuccess={onClose} />}
          {activeTab === 'email' && <EmailPasswordForm onSuccess={onClose} />}
          {activeTab === 'google' && <GoogleAuthButton onSuccess={onClose} />}
          {activeTab === 'userid' && <UserIdPasswordForm onSuccess={onClose} />}
        </div>

        {/* Security footnote */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Client-side session security guaranteed</span>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : null;
};
