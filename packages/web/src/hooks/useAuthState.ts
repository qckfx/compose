import type { User } from '@/schemas/auth';
import { AuthErrorSchema } from '@/schemas/auth';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { routes } from '@/api/routes';
import { toast } from 'sonner';

/**
 * Hook for managing authentication state
 */
export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /**
   * Fetch the current user from the API
   */
  const fetchUser = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      const data = await routes.fetchRoute('me');
      setUser(data.user);
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null);
      
      // Show toast notification for authentication errors
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          try {
            // Try to parse the error response with our schema
            const errorParsed = AuthErrorSchema.safeParse(error.response.data);
            const errorData = errorParsed.success ? errorParsed.data : { code: 'UNKNOWN_ERROR' };
            
            if (errorData.code === 'TOKEN_EXPIRED') {
              toast.error('Session expired', {
                description: 'Your session has expired. Please log in again.',
              });
            } else if (errorData.code === 'INVALID_TOKEN') {
              toast.error('Authentication error', {
                description: 'Your session is invalid. Please log in again.',
              });
            } else {
              toast.error('Authentication required', {
                description: 'Please log in to continue.',
              });
            }
          } catch {
            // Fallback for unparseable error responses
            toast.error('Authentication required', {
              description: 'Please log in to continue.',
            });
          }
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Log the user out
   */
  const logout = useCallback(async (): Promise<void> => {
    try {
      const result = await routes.fetchRoute('logout');
      if (result.success) {
        setUser(null);
        toast.success('Logged out');
      }
    } catch (error) {
      console.error('Error logging out:', error);
      
      if (axios.isAxiosError(error)) {
         
        const errorMessage = error.response?.data?.message || (error as Error).message || 'Unknown error';
        toast.error(`Failed to log out: ${errorMessage}`);
      } else {
        toast.error('Failed to log out. Please try again.');
      }
    }
  }, []);

  /**
   * Refresh the current user
   */
  const refreshUser = useCallback(async (): Promise<void> => {
    await fetchUser();
  }, [fetchUser]);

  // Initialize by fetching user data on mount
  useEffect(() => {
    void fetchUser();
  }, [fetchUser]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout,
    refreshUser,
    fetchUser,
  };
}