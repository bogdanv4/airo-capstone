import styles from './map.module.css';
import Icon from 'src/components/Icon/Icon';
import circle from 'src/assets/images/circle.svg';

export default function DevicePopup() {
  return (
    <div className={styles.popupContent}>
      <div className={styles.deviceInfoWrapper}>
        <div className={styles.polutionIconWrapper}>
          <div className={styles.polutionText}>
            <p className={styles.polutionTextMain}>7.8</p>
            <p className={styles.polutionTextSecondary}>PM2.5</p>
          </div>
          <img src={circle} alt="Air Polution Level image" />
        </div>
        <div className={styles.deviceInfo}>
          <p className={styles.deviceTitle}>Air Conditioner</p>
          <div className={styles.deviceAddress}>
            <Icon id="locationPinMiniIcon" width="12" height="12" />
            <span> Diagon Alley, 12</span>
          </div>
        </div>
      </div>
      <div className={styles.metricsWrapper}>
        <div className={styles.metric}>
          <p className={styles.metric__title}>CO2</p>
          <p className={styles.metric__number}>695.5</p>
        </div>
        <div className={styles.metric}>
          <p className={styles.metric__title}>Temp</p>
          <p className={styles.metric__number}>13 °C</p>
        </div>
        <div className={styles.metric}>
          <p className={styles.metric__title}>Metrics</p>
          <p className={styles.metric__number}>444.2</p>
        </div>
      </div>
    </div>
  );
}
