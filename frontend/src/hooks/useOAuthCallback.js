import { useEffect, useRef } from 'react';
import { useAuth } from './useAuth';

export function useOAuthCallback() {
  const { verifyToken } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) {
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const error = urlParams.get('error');

    if (error) {
      console.error('Auth error:', error);
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    if (token) {
      hasProcessed.current = true;
      verifyToken(token);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [verifyToken]);
}
