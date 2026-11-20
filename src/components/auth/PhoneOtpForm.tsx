import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, KeyRound, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const PhoneOtpForm: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const { sendPhoneOtp, loginWithPhone } = useAuth();

  const [countryCode, setCountryCode] = useState<string>('+91');
  const [phoneNumber, setPhoneNumber] = useState<string>('9876543210');
  const [otp, setOtp] = useState<string>('');
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const countryCodes = [
    { code: '+91', country: 'IN', label: 'India (+91)' },
    { code: '+1', country: 'US', label: 'United States (+1)' },
    { code: '+44', country: 'GB', label: 'United Kingdom (+44)' },
    { code: '+49', country: 'DE', label: 'Germany (+49)' },
  ];

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;
    setIsLoading(true);
    try {
      await sendPhoneOtp(countryCode, phoneNumber.trim());
      setIsOtpSent(true);
      setOtp('123456'); // pre-fill for demo convenience
    } catch {
      // handled in context toast
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const ok = await loginWithPhone(countryCode, phoneNumber.trim(), otp.trim());
      if (ok && onSuccess) onSuccess();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {!isOtpSent ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Mobile Phone Number
            </label>
            <div className="flex rounded-xl border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 bg-white">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-700 border-r border-slate-200 focus:outline-none cursor-pointer"
              >
                {countryCodes.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.label}
                  </option>
                ))}
              </select>
              <div className="relative flex-1">
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  required
                />
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Demo Phone verification: instant test OTP provided
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading || phoneNumber.length < 5}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Get OTP</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500">OTP sent to:</span>
              <p className="font-bold text-slate-800">
                {countryCode} {phoneNumber}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOtpSent(false)}
              className="text-xs font-semibold text-emerald-700 hover:underline"
            >
              Change
            </button>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Enter 6-Digit OTP
              </label>
              <button
                type="button"
                onClick={() => setOtp('123456')}
                className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" /> Auto-fill Demo OTP (123456)
              </button>
            </div>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm font-mono tracking-widest text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || otp.length !== 6}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Verify & Continue</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};
