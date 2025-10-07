import { useEffect } from 'react';
import { useAuth } from './useAuth';

export function useOAuthCallback() {
  const { verifyToken } = useAuth();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const error = urlParams.get('error');

    if (error) {
      console.error('Auth error:', error);
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    if (token) {
      verifyToken(token);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [verifyToken]);
}
