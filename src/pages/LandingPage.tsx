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
    <div className="min-h-screen flex flex-col bg-[#f6f5f4] text-[#000000] font-sans selection:bg-[#e6f3fe] selection:text-[#0075de]">
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
