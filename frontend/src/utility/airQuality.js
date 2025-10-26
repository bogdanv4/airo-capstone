import { OPEN_WEATHER_API_BASE_URL, API_BASE_URL } from 'src/constants/const';

export function getAirQualityColor(pm25) {
  if (!pm25 && pm25 !== 0) {
    return 'green';
  }

  if (pm25 < 12) {
    return 'green';
  }

  if (pm25 < 35) {
    return 'yellow';
  }

  return 'red';
}

export async function fetchAirQualityData(lat, lng, apiKey) {
  try {
    const response = await fetch(
      `${OPEN_WEATHER_API_BASE_URL}?lat=${lat}&lon=${lng}&appid=${apiKey}`,
    );

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.list[0].components.pm2_5;
  } catch (error) {
    console.error('Error fetching air quality:', error);
    return null;
  }
}

export async function updateDeviceAirQuality(deviceId, pm25) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/device/${deviceId}/air-quality`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pm25 }),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update air quality');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating device air quality:', error);
    throw error;
  }
}
