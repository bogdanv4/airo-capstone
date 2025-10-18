import styles from './map.module.css';
import Icon from 'src/components/Icon/Icon';
import circle from 'src/assets/images/circle.svg';

export default function DevicePopup({ device, address, isLoading }) {
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

  const getCO2Level = (co2) => {
    if (!co2) {
      return 'green';
    }
    if (co2 < 800) {
      return 'green';
    }
    if (co2 < 1200) {
      return 'yellow';
    }
    return 'red';
  };

  const getTempLevel = (temp) => {
    if (!temp) {
      return 'green';
    }
    if (temp >= 18 && temp <= 24) {
      return 'green';
    }
    if ((temp >= 15 && temp < 18) || (temp > 24 && temp <= 28)) {
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

  const pollutionLevel = device.metrics?.pm2_5
    ? getPollutionLevel(device.metrics.pm2_5)
    : 'green';

  const co2Level = device.metrics?.co2
    ? getCO2Level(device.metrics.co2)
    : 'green';

  const tempLevel = device.metrics?.temp
    ? getTempLevel(device.metrics.temp)
    : 'green';

  const humidityLevel = device.metrics?.humidity
    ? getHumidityLevel(device.metrics.humidity)
    : 'green';

  return (
    <div className={styles.popupContent}>
      <div className={styles.deviceInfoWrapper}>
        <div className={styles.polutionIconWrapper}>
          <div className={styles.polutionText}>
            <p className={styles.polutionTextMain}>
              {device.metrics?.pm2_5 || 'N/A'}
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

      {device.metrics && (
        <div className={styles.metricsWrapper}>
          <div className={`${styles.metric} ${styles[`metric-${co2Level}`]}`}>
            <p className={styles.metric__title}>CO₂</p>
            <p className={styles.metric__number}>
              {device.metrics.co2 || 'N/A'}
            </p>
          </div>
          <div className={`${styles.metric} ${styles[`metric-${tempLevel}`]}`}>
            <p className={styles.metric__title}>Temp</p>
            <p className={styles.metric__number}>
              {device.metrics.temp ? `${device.metrics.temp} °C` : 'N/A'}
            </p>
          </div>
          <div
            className={`${styles.metric} ${styles[`metric-${humidityLevel}`]}`}
          >
            <p className={styles.metric__title}>Humidity</p>
            <p className={styles.metric__number}>
              {device.metrics.humidity ? `${device.metrics.humidity}%` : 'N/A'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
