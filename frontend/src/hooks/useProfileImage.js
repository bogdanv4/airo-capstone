import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useLocalStorage } from './useLocalStorage';

export function useProfileImage(pictureUrl) {
  const [imageError, setImageError] = useState(false);
  const { verifyToken } = useAuth();
  const { getItem: getToken } = useLocalStorage('loginToken');

  useEffect(() => {
    if (pictureUrl) {
      setImageError(false);
    }
  }, [pictureUrl]);

  const handleImageError = useCallback(() => {
    console.error('Profile image failed to load:', pictureUrl);
    setImageError(true);

    const token = getToken();
    if (token && pictureUrl) {
      console.log('Attempting to re-verify token to get fresh picture URL...');
      verifyToken(token).catch((error) => {
        console.error('Failed to re-verify token:', error);
      });
    }
  }, [pictureUrl, getToken, verifyToken]);

  const handleImageLoad = useCallback(() => {
    setImageError(false);
  }, []);

  return { imageError, handleImageError, handleImageLoad };
}
