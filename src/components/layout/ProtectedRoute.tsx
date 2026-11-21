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
      <div className="min-h-screen flex items-center justify-center bg-[#f6f5f4]">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#0075de] mx-auto" />
          <p className="text-xs text-[#757575] font-medium">Verifying Contrey session...</p>
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
