import { useState } from 'react';
import styles from './modal.module.css';
import { CORDS_TO_LOCATION_BASE_URL } from 'src/constants/const';
import Button from 'src/components/Button/Button';
import Icon from 'src/components/Icon/Icon';

export default function Device() {
  const [location, setLocation] = useState('');
  const [dataFormat, setDataFormat] = useState('json');

  async function handleLocation() {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `${CORDS_TO_LOCATION_BASE_URL}?lat=${coords.latitude}&lon=${coords.longitude}&format=json&accept-language=sr-Latn`,
          );
          const data = await res.json();
          const { road, house_number } = data.address || {};

          const shortAddress = [road, house_number].filter(Boolean).join(' ');
          setLocation(
            shortAddress || `${coords.latitude}, ${coords.longitude}`,
          );
        } catch (err) {
          console.error(err);
        }
      },
      (err) => {
        console.error(err);
        alert('Unable to get location');
      },
    );
  }

  return (
    <form className={styles.modal__form}>
      <div className={styles.modal__column}>
        <div className={styles.modal__field}>
          <label htmlFor="name">Device's name</label>
          <input
            className={styles.modal__input}
            type="text"
            name="name"
            id="name"
            placeholder="Type name..."
          />
        </div>
        <div
          className={`${styles.modal__field} ${styles[`modal__field--second`]}`}
        >
          <label htmlFor="name">Description</label>
          <input
            className={styles.modal__input}
            type="text"
            name="description"
            id="description"
            placeholder="Type description..."
          />
        </div>
        <div className={styles.modal__field}>
          <label htmlFor="gateway">Gateway</label>
          <select className={styles.modal__input} name="gateway" id="gateway">
            <option value="Gateway 3">Gateway 3</option>
          </select>
          <Icon id="arrowDownSlimIcon" width="10" height="7" />
        </div>
        <div
          className={`${styles.modal__field} ${styles[`modal__field--fourth`]}`}
        >
          <label htmlFor="location">Location</label>
          <div className={styles.modal__location}>
            <input
              className={styles.modal__input}
              type="text"
              name="location"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <button type="button" onClick={handleLocation}>
              <Icon id="locationPinIcon" width="18" height="24" />
            </button>
          </div>
        </div>
      </div>
      <div className={styles.modal__column}>
        <div className={styles.modal__field}>
          <label htmlFor="data">Data format</label>
          <div className={styles.modal__buttons}>
            <Button
              type="button"
              className={`${styles.modal__button} ${
                dataFormat === 'json'
                  ? styles['modal__button--active']
                  : styles['modal__button--inactive']
              }`}
              onClick={() => setDataFormat('json')}
            >
              JSON Value
            </Button>
            <Button
              type="button"
              className={`${styles.modal__button} ${
                dataFormat === 'single'
                  ? styles['modal__button--active']
                  : styles['modal__button--inactive']
              }`}
              onClick={() => setDataFormat('single')}
            >
              Single Value
            </Button>
          </div>
        </div>
        {dataFormat === 'json' && (
          <>
            <div
              className={`${styles.modal__field} ${styles[`modal__field--second`]}`}
            >
              <label htmlFor="metrics">Metrics to be tracked</label>
              <select
                className={styles.modal__input}
                name="metrics"
                id="metrics"
              >
                <option value="Gateway 3">Select metrics</option>
              </select>
              <Icon id="arrowDownSlimIcon" width="10" height="7" />
            </div>
            <div className={styles.modal__field}>
              <label htmlFor="publicMetrics">Public metrics</label>
              <select
                className={styles.modal__input}
                name="publicMetrics"
                id="publicMetrics"
              >
                <option value="Gateway 3">Select metrics</option>
              </select>
              <Icon id="arrowDownSlimIcon" width="10" height="7" />
            </div>
          </>
        )}
      </div>
    </form>
  );
}
