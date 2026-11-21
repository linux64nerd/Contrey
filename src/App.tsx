import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TripProvider, useTrip } from './context/TripContext';
import { NotificationProvider } from './context/NotificationContext';
import { LandingPage } from './pages/LandingPage';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { AuthModal } from './components/auth/AuthModal';
import { Toaster } from 'sonner';

// Lazy-load heavier routes to keep initial bundle ultra-light and fast
const LoginPage = lazy(() => import('./pages/LoginPage').then((m) => ({ default: m.LoginPage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage })));
const MapRecommendationsPage = lazy(() => import('./pages/MapRecommendationsPage').then((m) => ({ default: m.MapRecommendationsPage })));
const FeaturesPage = lazy(() => import('./pages/FeaturesPage').then((m) => ({ default: m.FeaturesPage })));
const HowItWorksPage = lazy(() => import('./pages/HowItWorksPage').then((m) => ({ default: m.HowItWorksPage })));

// Lightweight loader for route transitions
const RouteFallback: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
    <div className="flex flex-col items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-[#4d49fc] text-white flex items-center justify-center font-bold text-sm shadow-sm shadow-[#4d49fc]/20">
        C
      </div>
      <div className="w-5 h-5 border-2 border-[#4d49fc] border-t-transparent rounded-full animate-spin" />
    </div>
  </div>
);

const AppContent: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authModalTab } = useAuth();
  const { activeTrip, activeTripExpenses } = useTrip();

  return (
    <NotificationProvider activeTrip={activeTrip} expenses={activeTripExpenses}>
      <BrowserRouter>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            {/* Landing page always opens directly at / and /home */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<LandingPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/guide" element={<HowItWorksPage />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/map"
              element={
                <ProtectedRoute>
                  <MapRecommendationsPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>

      {/* Global Auth Modal accessible across the app */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        defaultTab={authModalTab}
      />

      <Toaster position="top-right" richColors />
    </NotificationProvider>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CurrencyProvider>
          <TripProvider>
            <AppContent />
          </TripProvider>
        </CurrencyProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
