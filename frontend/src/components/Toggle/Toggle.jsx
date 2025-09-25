import { useState } from 'react';
import styles from './toggle.module.css';

export default function Toggle({ label }) {
  const [isToggleOn, setIsToggleOn] = useState(false);

  function handleToggle() {
    setIsToggleOn((prevToggle) => !prevToggle);
  }
  return (
    <div className={styles.toogle__wrapper}>
      <p className={styles.toggle__text}>{label}</p>
      <button
        type="button"
        role="switch"
        aria-checked={isToggleOn}
        className={styles.toggle__button}
        onClick={handleToggle}
      >
        <div
          className={`${styles.circle} ${isToggleOn ? styles.hidden : styles.off}`}
        ></div>
        <div
          className={`${styles.circle} ${!isToggleOn ? styles.hidden : styles.on}`}
        ></div>
      </button>
    </div>
  );
}
