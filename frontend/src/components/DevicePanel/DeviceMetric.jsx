import styles from './devicePanel.module.css';

export default function DeviceMetric({ metric, normalRange, value }) {
  return (
    <div className={styles.metric}>
      <div className={styles.metric__title}>
        <h2>{metric}</h2>
        {normalRange && <p>Normal range: {normalRange}</p>}
      </div>
      <p className={styles.center}>{value}</p>
    </div>
  );
}
