import React, { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from '@/components/LoadingSpinner';

interface PrivateRouteProps {
  children: ReactNode;
  redirectTo?: string; // Optional redirect path, defaults to '/'
}

/**
 * A route wrapper that ensures the user is authenticated
 * and prevents flashing unauthorized content during authentication checks
 */
const PrivateRoute: React.FC<PrivateRouteProps> = ({ 
  children, 
  redirectTo = '/login' 
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Perform server-side redirect when unauthenticated (break out of SPA)
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const fromPath = location.pathname;
      // Encode the return path in base64 so the server can decode it later
      const encodedReturnUrl = window.btoa(fromPath);
      const redirectUrl = `${redirectTo}?returnUrl=${encodeURIComponent(encodedReturnUrl)}`;
      // Full page redirect to server-side route
      window.location.replace(redirectUrl);
    }
  }, [isLoading, isAuthenticated, location.pathname, redirectTo]);

  // Show loading spinner while authentication status is being determined
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // If redirection is in progress (unauthenticated), render nothing
  if (!isAuthenticated) {
    return null;
  }

  // If authenticated, render the protected content
  return <>{children}</>;
};

export default PrivateRoute;