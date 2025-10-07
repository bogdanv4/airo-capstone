import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  login as loginAction,
  logout as logoutAction,
} from 'src/redux/actions';
import { AUTH_URL, VERIFY_TOKEN_URL, LOGOUT_URL } from 'src/constants/const';
import { useLocalStorage } from './useLocalStorage';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const signedIn = useSelector((state) => state.auth.signedIn);

  const { getItem, setItem, removeItem } = useLocalStorage('loginToken');

  // Initiate Google OAuth flow
  const initiateLogin = useCallback(async () => {
    try {
      const response = await fetch(AUTH_URL);
      const { url } = await response.json();

      window.location.href = url;
    } catch (error) {
      console.error('Error initiating login:', error);
    }
  }, []);

  // Verify token and fetch user info
  const verifyToken = useCallback(
    async (token) => {
      setLoading(true);
      try {
        const response = await fetch(VERIFY_TOKEN_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error('Token verification failed');
        }

        const userInfo = await response.json();
        dispatch(loginAction(userInfo, token));
        setItem(token);
      } catch (error) {
        console.error('Token verification error:', error);
        removeItem();
        dispatch(logoutAction());
      } finally {
        setLoading(false);
      }
    },
    [dispatch, removeItem, setItem],
  );

  // Logout
  const logout = useCallback(async () => {
    const token = getItem();

    if (token) {
      try {
        await fetch(LOGOUT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }

    removeItem();
    dispatch(logoutAction());
  }, [getItem, removeItem, dispatch]);

  // Check for stored token on mount
  useEffect(() => {
    const storedToken = getItem();

    if (storedToken && !signedIn) {
      verifyToken(storedToken);
    }
  }, [signedIn, verifyToken, getItem]);

  return { loading, initiateLogin, logout, verifyToken };
}
