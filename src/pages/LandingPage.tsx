import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { HeroSection } from '../components/landing/HeroSection';
import { FeaturesGrid } from '../components/landing/FeaturesGrid';
import { HowItWorks } from '../components/landing/HowItWorks';
import { useNavigate } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleOpenAuth = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-emerald-500 selection:text-white">
      <Navbar onOpenAuth={handleOpenAuth} />
      <main className="flex-1">
        <HeroSection onGetStarted={handleOpenAuth} />
        <FeaturesGrid />
        <HowItWorks onGetStarted={handleOpenAuth} />
      </main>
      <Footer />
    </div>
  );
};
