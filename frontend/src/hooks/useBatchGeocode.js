import { useState, useEffect, useCallback } from 'react';
import { reverseGeocode } from 'src/utility/geocoding';

export function useBatchGeocode(locations = [], language = 'sr-Latn') {
  const [addresses, setAddresses] = useState(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!locations || locations.length === 0) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function fetchAddresses() {
      try {
        setLoading(true);
        const newAddresses = new Map();

        for (const location of locations) {
          if (!isMounted) {
            break;
          }

          const key = `${location.lat},${location.lng}`;

          if (addresses.has(key)) {
            newAddresses.set(key, addresses.get(key));
            continue;
          }

          const address = await reverseGeocode(
            location.lat,
            location.lng,
            language,
          );
          newAddresses.set(key, address);

          if (isMounted) {
            setAddresses(new Map(newAddresses));
          }

          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        if (isMounted) {
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchAddresses();

    return () => {
      isMounted = false;
    };
  }, [locations, language, addresses]);

  const getAddress = useCallback(
    (lat, lng) => {
      const key = `${lat},${lng}`;
      return addresses.get(key) || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    },
    [addresses],
  );

  return { addresses, getAddress, loading, error };
}
