import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface PhoneOtpFormProps {
  onSuccess?: () => void;
}

export const PhoneOtpForm: React.FC<PhoneOtpFormProps> = ({ onSuccess }) => {
  const { sendPhoneOtp, loginWithPhone } = useAuth();
  const [countryCode, setCountryCode] = useState<string>('+91');
  const [phoneNumber, setPhoneNumber] = useState<string>('9876543210');
  const [otp, setOtp] = useState<string>('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim() || phoneNumber.trim().length < 7) {
      toast.error('Please enter a valid phone number (at least 7 digits)');
      return;
    }

    setIsLoading(true);
    try {
      await sendPhoneOtp(countryCode, phoneNumber.trim());
      setStep('otp');
    } catch {
      // toast shown in context
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      toast.error('Please enter the 6-digit OTP (demo: 123456)');
      return;
    }

    setIsLoading(true);
    const success = await loginWithPhone(countryCode, phoneNumber.trim(), otp.trim());
    setIsLoading(false);

    if (success && onSuccess) {
      onSuccess();
    }
  };

  return (
    <div className="space-y-4">
      {step === 'phone' ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Phone Number
            </label>
            <div className="flex gap-2">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-24 px-2 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="+91">+91 (IN)</option>
                <option value="+1">+1 (US)</option>
                <option value="+44">+44 (UK)</option>
                <option value="+33">+33 (FR)</option>
                <option value="+49">+49 (DE)</option>
              </select>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="9876543210"
                className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono font-medium"
                required
              />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Demo SMS OTP: <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">123456</span>
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full !py-2.5 !text-xs !rounded-xl"
          >
            <span>{isLoading ? 'Generating SMS Code…' : 'Send Verification OTP'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="text-center space-y-1">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">Verify Phone</span>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Enter 6-digit code sent to <span className="font-mono text-slate-900 dark:text-white font-bold">{countryCode} {phoneNumber}</span>
            </p>
          </div>

          <div>
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
              className="w-full text-center tracking-[0.5em] text-xl font-bold font-mono py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              autoFocus
            />
            <p className="text-[11px] text-center text-slate-500 dark:text-slate-400 mt-1">
              Enter <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">123456</span> for instant sign in
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full !py-2.5 !text-xs !rounded-xl"
          >
            <span>{isLoading ? 'Verifying Code…' : 'Verify & Continue'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setStep('phone')}
            className="w-full text-center text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white font-medium"
          >
            ← Change phone number
          </button>
        </form>
      )}
    </div>
  );
};
