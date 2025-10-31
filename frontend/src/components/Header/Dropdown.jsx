import styles from './header.module.css';

export default function Dropdown({ devices, onSelect }) {
  if (!devices || devices.length === 0) {
    return null;
  }

  return (
    <div className={styles.dropdown}>
      <ul>
        {devices.map((device) => (
          <li
            key={device._id}
            className={styles.dropdown__text}
            onClick={() => onSelect(device)}
          >
            {device.name || 'Loading...'}
          </li>
        ))}
      </ul>
    </div>
  );
}
