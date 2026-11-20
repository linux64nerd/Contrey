import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types/auth';
import { storageService } from '../services/storageService';
import { toast } from 'sonner';

interface AuthContextType extends AuthState {
  sendPhoneOtp: (countryCode: string, phone: string) => Promise<string>;
  loginWithPhone: (countryCode: string, phone: string, otp: string) => Promise<boolean>;
  loginWithEmail: (email: string, password: string) => Promise<boolean>;
  signupWithEmail: (name: string, email: string, password: string, phone?: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  loginWithUserId: (userId: string, password: string) => Promise<boolean>;
  quickDemoLogin: () => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  openAuthModal: (initialTab?: 'phone' | 'email' | 'google' | 'userid') => void;
  closeAuthModal: () => void;
  authModalTab: 'phone' | 'email' | 'google' | 'userid';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => storageService.getUser<User>());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'phone' | 'email' | 'google' | 'userid'>('phone');

  useEffect(() => {
    // Initial sync
    const storedUser = storageService.getUser<User>();
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const openAuthModal = (initialTab: 'phone' | 'email' | 'google' | 'userid' = 'phone') => {
    setAuthModalTab(initialTab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // 1. Phone + OTP Flow
  const sendPhoneOtp = async (countryCode: string, phone: string): Promise<string> => {
    if (!phone || phone.length < 7) {
      toast.error('Please enter a valid phone number');
      throw new Error('Invalid phone number');
    }

    // Demo OTP is 123456
    const demoOtp = '123456';
    await new Promise((resolve) => setTimeout(resolve, 600));

    toast.info(`🔑 Demo OTP for ${countryCode} ${phone}: ${demoOtp}`, {
      duration: 10000,
      description: 'Copy and paste "123456" into the OTP box to proceed.',
    });

    return demoOtp;
  };

  const loginWithPhone = async (countryCode: string, phone: string, otp: string): Promise<boolean> => {
    if (otp.trim() !== '123456') {
      toast.error('Invalid OTP. Use demo OTP: 123456');
      return false;
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: `Traveler ${phone.slice(-4)}`,
      phone: `${countryCode}${phone}`,
      authMethod: 'phone',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${phone}`,
      upiId: `${phone.slice(-4)}@upi`,
    };

    setUser(newUser);
    storageService.setUser(newUser);
    toast.success(`Welcome back, ${newUser.name}!`);
    closeAuthModal();
    return true;
  };

  // 2. Email + Password Flow
  const loginWithEmail = async (email: string, password: string): Promise<boolean> => {
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return false;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }

    const cleanName = email.split('@')[0].replace(/[._]/g, ' ');
    const formattedName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: formattedName || 'Traveler',
      email,
      authMethod: 'email',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      upiId: `${email.split('@')[0]}@okaxis`,
    };

    setUser(newUser);
    storageService.setUser(newUser);
    toast.success(`Signed in as ${newUser.email}`);
    closeAuthModal();
    return true;
  };

  const signupWithEmail = async (name: string, email: string, password: string, phone?: string): Promise<boolean> => {
    if (!name || !email || !password) {
      toast.error('Please fill in all required fields');
      return false;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name,
      email,
      phone: phone || '+919876543210',
      authMethod: 'email',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      upiId: `${name.toLowerCase().replace(/\s+/g, '')}@okaxis`,
    };

    setUser(newUser);
    storageService.setUser(newUser);
    toast.success(`Account created! Welcome to Contrey, ${name}!`);
    closeAuthModal();
    return true;
  };

  // 3. Google Account Flow
  const loginWithGoogle = async (): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const googleUser: User = {
      id: 'usr_google_demo_99',
      name: 'Aarav Sharma',
      email: 'aarav.sharma@gmail.com',
      phone: '+919876543210',
      authMethod: 'google',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      upiId: 'aarav@okhdfcbank',
    };

    setUser(googleUser);
    storageService.setUser(googleUser);
    toast.success('Connected with Google Account');
    closeAuthModal();
    return true;
  };

  // 4. User ID & Password Flow
  const loginWithUserId = async (userId: string, password: string): Promise<boolean> => {
    if (!userId || !password) {
      toast.error('Please enter User ID and Password');
      return false;
    }

    const newUser: User = {
      id: `usr_${userId}`,
      name: userId,
      authMethod: 'userid',
      avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${userId}`,
      upiId: `${userId}@upi`,
    };

    setUser(newUser);
    storageService.setUser(newUser);
    toast.success(`Logged in as @${userId}`);
    closeAuthModal();
    return true;
  };

  // Demo Quick Login
  const quickDemoLogin = () => {
    const demoUser: User = {
      id: 'usr_demo_101',
      name: 'Rohan Mehta',
      email: 'rohan.mehta@contrey.travel',
      phone: '+919820012345',
      authMethod: 'phone',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      upiId: 'rohan@okaxis',
    };

    setUser(demoUser);
    storageService.setUser(demoUser);
    toast.success(`Demo Login: Signed in as ${demoUser.name}`);
    closeAuthModal();
  };

  const logout = () => {
    setUser(null);
    storageService.setUser(null);
    toast.info('Signed out of Contrey');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        sendPhoneOtp,
        loginWithPhone,
        loginWithEmail,
        signupWithEmail,
        loginWithGoogle,
        loginWithUserId,
        quickDemoLogin,
        logout,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        authModalTab,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
