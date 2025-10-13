import { CORDS_TO_LOCATION_BASE_URL } from 'src/constants/const';

export async function reverseGeocode(lat, lng, language = 'sr-Latn') {
  try {
    const res = await fetch(
      `${CORDS_TO_LOCATION_BASE_URL}?lat=${lat}&lon=${lng}&format=json&accept-language=${language}`,
    );

    if (!res.ok) {
      throw new Error('Geocoding request failed');
    }

    const data = await res.json();
    const { road, house_number, suburb, city } = data.address || {};

    const shortAddress = [road, house_number].filter(Boolean).join(' ');

    const locationName = shortAddress || suburb || city;

    return locationName || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  } catch (err) {
    console.error('Reverse geocoding error:', err);
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
}

export async function getCurrentLocationAddress(language = 'sr-Latn') {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const address = await reverseGeocode(
            coords.latitude,
            coords.longitude,
            language,
          );

          resolve({
            address,
            coords: {
              lat: coords.latitude,
              lng: coords.longitude,
            },
          });
        } catch (err) {
          reject(err);
        }
      },
      (err) => {
        reject(err);
      },
    );
  });
}

export async function batchReverseGeocode(locations, language = 'sr-Latn') {
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const addresses = [];

  for (let i = 0; i < locations.length; i++) {
    const { lat, lng } = locations[i];
    const address = await reverseGeocode(lat, lng, language);
    addresses.push(address);

    if (i < locations.length - 1) {
      await delay(1000);
    }
  }

  return addresses;
}
