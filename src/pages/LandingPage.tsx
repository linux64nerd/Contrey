import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { HeroSection } from '../components/landing/HeroSection';
import { FeaturesGrid } from '../components/landing/FeaturesGrid';
import { HowItWorks } from '../components/landing/HowItWorks';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const { openAuthModal } = useAuth();

  const handleOpenAuth = (tab?: 'phone' | 'email' | 'google' | 'userid') => {
    openAuthModal(tab || 'phone');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-emerald-500 selection:text-white">
      <Navbar onOpenAuth={handleOpenAuth} />
      <main className="flex-1">
        <HeroSection onGetStarted={() => handleOpenAuth('phone')} />
        <FeaturesGrid />
        <HowItWorks onGetStarted={() => handleOpenAuth('phone')} />
      </main>
      <Footer />
    </div>
  );
};
