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

  const pollutionLevel = device.metrics?.pm2_5
    ? getPollutionLevel(device.metrics.pm2_5)
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
          <div className={styles.metric}>
            <p className={styles.metric__title}>CO₂</p>
            <p className={styles.metric__number}>
              {device.metrics.co2 || 'N/A'}
            </p>
          </div>
          <div className={styles.metric}>
            <p className={styles.metric__title}>Temp</p>
            <p className={styles.metric__number}>
              {device.metrics.temp ? `${device.metrics.temp} °C` : 'N/A'}
            </p>
          </div>
          <div className={styles.metric}>
            <p className={styles.metric__title}>Humidity</p>
            <p className={styles.metric__number}>
              {device.metrics.humidity || 'N/A'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
