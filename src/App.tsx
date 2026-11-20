import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CurrencyProvider } from './context/CurrencyContext';
import { LandingPage } from './pages/LandingPage';
import { Toaster } from 'sonner';

// Placeholder for Login page during Checkpoint 1
const LoginPlaceholder: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
    <div className="p-8 bg-white rounded-2xl shadow-xl max-w-md w-full text-center space-y-4">
      <h2 className="text-2xl font-bold text-slate-900">Contrey Authentication Gate</h2>
      <p className="text-sm text-slate-600">
        Multi-method authentication (Phone + OTP, Email, Google, User ID) is arriving in Checkpoint 2!
      </p>
      <a
        href="/"
        className="inline-block px-5 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
      >
        ← Back to Landing Page
      </a>
    </div>
  </div>
);

export const App: React.FC = () => {
  return (
    <CurrencyProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPlaceholder />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </CurrencyProvider>
  );
};

export default App;
