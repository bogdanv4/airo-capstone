import { useState, useEffect } from 'react';
import { reverseGeocode } from 'src/utility/geocoding';

export function useReverseGeocode(lat, lng, language = 'sr-Latn') {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!lat || !lng) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function fetchAddress() {
      try {
        setLoading(true);
        const result = await reverseGeocode(lat, lng, language);

        if (isMounted) {
          setAddress(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
          setAddress(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchAddress();

    return () => {
      isMounted = false;
    };
  }, [lat, lng, language]);

  return { address, loading, error };
}
