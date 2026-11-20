import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CurrencyProvider } from './context/CurrencyContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TripProvider, useTrip } from './context/TripContext';
import { NotificationProvider } from './context/NotificationContext';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { MapRecommendationsPage } from './pages/MapRecommendationsPage';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { AuthModal } from './components/auth/AuthModal';
import { Toaster } from 'sonner';

const AppContent: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authModalTab } = useAuth();
  const { activeTrip, activeTripExpenses } = useTrip();

  return (
    <NotificationProvider activeTrip={activeTrip} expenses={activeTripExpenses}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
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
    <AuthProvider>
      <CurrencyProvider>
        <TripProvider>
          <AppContent />
        </TripProvider>
      </CurrencyProvider>
    </AuthProvider>
  );
};

export default App;
