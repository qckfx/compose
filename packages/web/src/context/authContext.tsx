import type { ReactNode } from 'react';
import React from 'react';
import { useAuthState } from '@/hooks/useAuthState';
import { AuthContext } from '@/hooks/useAuth';

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Provider component for authentication state
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Use the refactored hook for all auth state management
  const authState = useAuthState();
  
  // Provide the auth state to the context
  return <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>;
};