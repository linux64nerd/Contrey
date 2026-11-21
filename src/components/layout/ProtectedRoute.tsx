import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { isValidUser } from '../../services/storageService';
import { Loader2 } from 'lucide-react';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors">
        <div className="text-center space-y-3">
          <div className="w-9 h-9 rounded-xl bg-[#4d49fc] text-white flex items-center justify-center font-bold text-sm shadow-md shadow-[#4d49fc]/30 mx-auto animate-pulse">
            C
          </div>
          <Loader2 className="w-5 h-5 animate-spin text-[#4d49fc] mx-auto" />
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Verifying Contrey session...</p>
        </div>
      </div>
    );
  }

  // Strict session schema guard
  if (!isAuthenticated || !user || !isValidUser(user)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
