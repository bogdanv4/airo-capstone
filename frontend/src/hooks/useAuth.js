import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  login as loginAction,
  logout as logoutAction,
} from 'src/redux/actions';
import { USER_INFO_API_URL } from 'src/constants/const';
import { useLocalStorage } from 'src/hooks/useLocalStorage';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const signedIn = useSelector((state) => state.auth.signedIn);

  const { getItem, setItem, removeItem } = useLocalStorage('loginToken');

  const fetchUserInfo = useCallback(
    async (token) => {
      setLoading(true);
      try {
        const response = await fetch(USER_INFO_API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userInfo = await response.json();

        if (userInfo && userInfo.picture) {
          dispatch(loginAction(userInfo, token));
          setItem(token);
        } else {
          throw new Error('Invalid user info received');
        }
      } catch (error) {
        console.error(error);
        removeItem();
        dispatch(logoutAction());
      } finally {
        setLoading(false);
      }
    },
    [dispatch, removeItem, setItem],
  );

  useEffect(() => {
    const storedToken = getItem();

    if (storedToken && !signedIn) {
      fetchUserInfo(storedToken);
    }
  }, [signedIn, fetchUserInfo, getItem]);

  return { loading };
}
