import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TripProvider, useTrip } from './context/TripContext';
import { NotificationProvider } from './context/NotificationContext';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { MapRecommendationsPage } from './pages/MapRecommendationsPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { AuthModal } from './components/auth/AuthModal';
import { Toaster } from 'sonner';

const RootRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#4d49fc] text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-[#4d49fc]/30 animate-bounce">
            C
          </div>
          <div className="w-6 h-6 border-2 border-[#4d49fc] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return isAuthenticated ? <DashboardPage /> : <LandingPage />;
};

const AppContent: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authModalTab } = useAuth();
  const { activeTrip, activeTripExpenses } = useTrip();

  return (
    <NotificationProvider activeTrip={activeTrip} expenses={activeTripExpenses}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootRoute />} />
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
