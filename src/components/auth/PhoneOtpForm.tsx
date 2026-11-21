import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
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
            <label className="block text-xs font-medium text-[#000000] mb-1">
              Phone Number
            </label>
            <div className="flex gap-2">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-24 px-2 py-2 rounded-[8px] bg-[#ffffff] border border-[rgba(0,0,0,0.12)] text-[#000000] text-xs font-mono focus:outline-none focus:border-[#0075de]"
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
                className="flex-1 px-3 py-2 rounded-[8px] bg-[#ffffff] border border-[rgba(0,0,0,0.12)] text-[#000000] text-xs focus:outline-none focus:border-[#0075de] font-mono"
                required
              />
            </div>
            <p className="text-[11px] text-[#757575] mt-1">
              Demo SMS OTP: <span className="font-mono font-bold text-[#0075de]">123456</span>
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-[8px] bg-[#0075de] hover:bg-[#0066c0] text-[#ffffff] text-xs font-medium transition-colors shadow-xs flex items-center justify-center gap-2"
          >
            <span>{isLoading ? 'Generating SMS Code…' : 'Send Verification OTP'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="text-center space-y-1">
            <span className="text-xs uppercase tracking-wider text-[#757575] font-semibold">Verify Phone</span>
            <p className="text-xs text-[#615d59]">
              Enter code sent to <span className="font-mono text-[#000000] font-bold">{countryCode} {phoneNumber}</span>
            </p>
            <p className="text-[11px] text-[#0075de] font-medium">
              Demo Code: <span className="font-mono font-bold tracking-widest">123456</span>
            </p>
          </div>

          <div>
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="123456"
              className="w-full text-center tracking-[0.5em] text-lg font-mono py-2 rounded-[8px] bg-[#ffffff] border border-[rgba(0,0,0,0.12)] text-[#000000] focus:outline-none focus:border-[#0075de]"
              autoFocus
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-[8px] bg-[#0075de] hover:bg-[#0066c0] text-[#ffffff] text-xs font-medium transition-colors shadow-xs flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isLoading ? 'Verifying…' : 'Verify & Enter Contrey'}</span>
          </button>

          <button
            type="button"
            onClick={() => setStep('phone')}
            className="w-full text-center text-xs text-[#757575] hover:text-[#000000]"
          >
            ← Change phone number
          </button>
        </form>
      )}
    </div>
  );
};
