import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface UserIdPasswordFormProps {
  onSuccess?: () => void;
}

export const UserIdPasswordForm: React.FC<UserIdPasswordFormProps> = ({ onSuccess }) => {
  const { loginWithUserId } = useAuth();
  const [userId, setUserId] = useState<string>('usr_contrey_2026');
  const [password, setPassword] = useState<string>('securePass123');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim() || !password.trim()) {
      toast.error('Please enter User ID and Password');
      return;
    }

    setIsLoading(true);
    const success = await loginWithUserId(userId.trim(), password);
    setIsLoading(false);

    if (success && onSuccess) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-[#000000] mb-1">
          Custom User ID
        </label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="e.g. usr_explorer_99"
          className="w-full px-3 py-2 rounded-[8px] bg-[#ffffff] border border-[rgba(0,0,0,0.12)] text-[#000000] text-xs font-mono focus:outline-none focus:border-[#0075de]"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-[#000000] mb-1">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full px-3 py-2 rounded-[8px] bg-[#ffffff] border border-[rgba(0,0,0,0.12)] text-[#000000] text-xs focus:outline-none focus:border-[#0075de]"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2.5 rounded-[8px] bg-[#0075de] hover:bg-[#0066c0] text-[#ffffff] text-xs font-medium transition-colors shadow-xs flex items-center justify-center gap-2"
      >
        <span>{isLoading ? 'Verifying credentials…' : 'Sign In with User ID'}</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </form>
  );
};
