import { useCallback } from 'react';

export const useLocalStorage = (key = '') => {
  const setItem = useCallback(
    (value = '') => {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.log(error?.message);
      }
    },
    [key],
  );

  const getItem = useCallback(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : undefined;
    } catch (error) {
      console.log(error?.message);
    }
  }, [key]);

  const removeItem = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.log(error?.message);
    }
  }, [key]);

  return { setItem, getItem, removeItem };
};
