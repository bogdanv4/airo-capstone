import styles from './deviceCard.module.css';
import Icon from 'src/components/Icon/Icon';

export default function DeviceCard({ heading, address, icon }) {
  return (
    <div className={styles.deviceCard}>
      <div className={styles.deviceCard__icon}>
        <div className={styles.deviceCard__circle}></div>
        <Icon {...icon} />
      </div>
      <div className={styles.deviceCard__text}>
        <h3 className={styles.deviceCard__heading}>{heading}</h3>
        <p className={styles.deviceCard__address}>{address}</p>
      </div>
    </div>
  );
}
