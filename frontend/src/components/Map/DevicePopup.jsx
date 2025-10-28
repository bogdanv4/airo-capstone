import { useEffect, useState } from 'react';
import styles from './map.module.css';
import {
  OPEN_WEATHER_API_BASE_URL,
  OPEN_WEATHER_WEATHER_API_BASE_URL,
} from 'src/constants/const';
import Icon from 'src/components/Icon/Icon';
import circle from 'src/assets/images/circle.svg';

export default function DevicePopup({
  device,
  address,
  isLoading,
  lat,
  lng,
  onAirQualityUpdate,
}) {
  const [pollutionData, setPollutionData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);

  const getPollutionLevel = (pm25) => {
    if (!pm25) {
      return 'green';
    }
    if (pm25 < 12) {
      return 'green';
    }
    if (pm25 < 35) {
      return 'yellow';
    }
    return 'red';
  };

  const getCOLevel = (co) => {
    if (!co) {
      return 'green';
    }
    if (co < 4000) {
      return 'green';
    }
    if (co < 10000) {
      return 'yellow';
    }
    return 'red';
  };

  const getTempLevel = (temp) => {
    if (!temp) {
      return 'green';
    }
    if (temp >= 18 && temp <= 25) {
      return 'green';
    }
    if ((temp >= 10 && temp < 18) || (temp > 25 && temp <= 30)) {
      return 'yellow';
    }
    return 'red';
  };

  const getHumidityLevel = (humidity) => {
    if (!humidity) {
      return 'green';
    }
    if (humidity >= 40 && humidity <= 60) {
      return 'green';
    }
    if (
      (humidity >= 30 && humidity < 40) ||
      (humidity > 60 && humidity <= 70)
    ) {
      return 'yellow';
    }
    return 'red';
  };

  useEffect(() => {
    async function fetchEnvironmentalData() {
      setDataLoading(true);
      try {
        const pollutionUrl = `${OPEN_WEATHER_API_BASE_URL}?lat=${lat}&lon=${lng}&appid=${import.meta.env.VITE_OPEN_WEATHER_API_KEY}`;
        const weatherUrl = `${OPEN_WEATHER_WEATHER_API_BASE_URL}?lat=${lat}&lon=${lng}&units=metric&appid=${import.meta.env.VITE_OPEN_WEATHER_API_KEY}`;

        const [pollutionResponse, weatherResponse] = await Promise.all([
          fetch(pollutionUrl),
          fetch(weatherUrl),
        ]);

        if (!pollutionResponse.ok) {
          throw new Error(`Pollution API failed: ${pollutionResponse.status}`);
        }

        if (!weatherResponse.ok) {
          throw new Error(`Weather API failed: ${weatherResponse.status}`);
        }

        const pollutionData = await pollutionResponse.json();
        const weatherData = await weatherResponse.json();

        setPollutionData(pollutionData.list[0].components);
        setWeatherData({
          temp: Math.round(weatherData.main.temp),
          humidity: weatherData.main.humidity,
        });

        if (
          onAirQualityUpdate &&
          pollutionData.list[0].components.pm2_5 !== undefined
        ) {
          onAirQualityUpdate(device.id, pollutionData.list[0].components.pm2_5);
        }
      } catch (error) {
        console.error('Error fetching environmental data:', error);
        setPollutionData({});
        setWeatherData({});
      } finally {
        setDataLoading(false);
      }
    }

    if (lat && lng) {
      fetchEnvironmentalData();
    } else {
      setDataLoading(false);
    }
  }, [lat, lng, device.id, onAirQualityUpdate]);

  const pm25 = pollutionData?.pm2_5;
  const co = pollutionData?.co;
  const temp = weatherData?.temp;
  const humidity = weatherData?.humidity;

  const pollutionLevel = getPollutionLevel(pm25);
  const coLevel = getCOLevel(co);
  const tempLevel = getTempLevel(temp);
  const humidityLevel = getHumidityLevel(humidity);

  return (
    <div className={styles.popupContent}>
      <div className={styles.deviceInfoWrapper}>
        <div className={styles.polutionIconWrapper}>
          <div className={styles.polutionText}>
            <p className={styles.polutionTextMain}>
              {dataLoading ? '...' : pm25 ? pm25.toFixed(1) : 'N/A'}
            </p>
            <p className={styles.polutionTextSecondary}>PM2.5</p>
          </div>
          <img
            src={circle}
            alt="Air Pollution Level"
            className={styles[`circle-${pollutionLevel}`]}
          />
        </div>
        <div className={styles.deviceInfo}>
          <p className={styles.deviceTitle}>
            {device.name || 'Unknown Device'}
          </p>
          <div className={styles.deviceAddress}>
            <Icon id="locationPinMiniIcon" width="12" height="12" />
            <span>
              {isLoading ? 'Loading address...' : address || 'Unknown location'}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.metricsWrapper}>
        <div className={`${styles.metric} ${styles[`metric-${coLevel}`]}`}>
          <p className={styles.metric__title}>CO</p>
          <p className={styles.metric__number}>
            {dataLoading ? '...' : co ? `${(co / 1000).toFixed(1)}` : 'N/A'}
          </p>
          <p className={styles.metric__unit}>mg/m³</p>
        </div>
        <div className={`${styles.metric} ${styles[`metric-${tempLevel}`]}`}>
          <p className={styles.metric__title}>Temp</p>
          <p className={styles.metric__number}>
            {dataLoading ? '...' : temp !== undefined ? `${temp}°C` : 'N/A'}
          </p>
        </div>
        <div
          className={`${styles.metric} ${styles[`metric-${humidityLevel}`]}`}
        >
          <p className={styles.metric__title}>Humidity</p>
          <p className={styles.metric__number}>
            {dataLoading
              ? '...'
              : humidity !== undefined
                ? `${humidity}%`
                : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
}
