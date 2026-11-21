import React, { useEffect } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { HeroSection } from '../components/landing/HeroSection';
import { FeaturesGrid } from '../components/landing/FeaturesGrid';
import { HowItWorks } from '../components/landing/HowItWorks';
import { useNavigate, useLocation } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleOpenAuth = () => {
    navigate('/login');
  };

  useEffect(() => {
    let targetId = '';
    if (location.hash) {
      targetId = location.hash.replace('#', '');
    } else if (location.pathname === '/features') {
      targetId = 'features';
    } else if (location.pathname === '/how-it-works') {
      targetId = 'how-it-works';
    }

    if (targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 120);
      }
    }
  }, [location.pathname, location.hash]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-100 selection:text-indigo-900 transition-colors duration-200">
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
