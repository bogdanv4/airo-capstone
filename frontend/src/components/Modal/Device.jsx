import { useState } from 'react';
import { useSelector } from 'react-redux';
import styles from './modal.module.css';
import { getCurrentLocationAddress } from 'src/utility/geocoding';
import Button from 'src/components/Button/Button';
import Icon from 'src/components/Icon/Icon';

export default function Device({ onSubmit }) {
  const [location, setLocation] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const [dataFormat, setDataFormat] = useState('json');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    gatewayID: '',
    metrics: '',
    publicMetrics: '',
  });

  const userInfo = useSelector((state) => state.auth.user);
  const gateways = useSelector((state) => state.data.gateways);

  async function handleLocation() {
    try {
      setLoading(true);
      const result = await getCurrentLocationAddress('sr-Latn');
      setLocation(result.address);
      setCoordinates(result.coords);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Unable to get location');
    } finally {
      setLoading(false);
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !location) {
      alert('Please fill in all required fields!');
      return;
    }

    if (!coordinates.lat || !coordinates.lng) {
      alert('Please select a valid location!');
      return;
    }

    const deviceData = {
      userId: userInfo?.sub,
      name: formData.name,
      description: formData.description,
      gatewayID: formData.gatewayID || null,
      location: coordinates,
      dataFormat,
      metrics: dataFormat === 'json' ? {} : null,
    };

    onSubmit(deviceData);
  };

  return (
    <form className={styles.modal__form} onSubmit={handleSubmit}>
      <div className={styles.modal__column}>
        <div className={styles.modal__field}>
          <label htmlFor="name">Device's name *</label>
          <input
            className={styles.modal__input}
            type="text"
            name="name"
            id="name"
            placeholder="Type name..."
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div
          className={`${styles.modal__field} ${styles[`modal__field--second`]}`}
        >
          <label htmlFor="description">Description *</label>
          <input
            className={styles.modal__input}
            type="text"
            name="description"
            id="description"
            placeholder="Type description..."
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className={styles.modal__field}>
          <label htmlFor="gateway">Gateway</label>
          <select
            className={styles.modal__input}
            name="gatewayID"
            id="gateway"
            value={formData.gatewayID}
            onChange={handleInputChange}
          >
            <option value="">No gateway</option>
            {gateways.map((gateway) => (
              <option key={gateway.id} value={gateway.id}>
                {gateway.name}
              </option>
            ))}
          </select>
          <Icon id="arrowDownSlimIcon" width="10" height="7" />
        </div>
        <div
          className={`${styles.modal__field} ${styles[`modal__field--fourth`]}`}
        >
          <label htmlFor="location">Location *</label>
          <div className={styles.modal__location}>
            <input
              className={styles.modal__input}
              type="text"
              name="location"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Get current location or type address"
              required
            />
            <button type="button" onClick={handleLocation} disabled={loading}>
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
                value={formData.metrics}
                onChange={handleInputChange}
              >
                <option value="">Select metrics</option>
                <option value="pm2_5">PM2.5</option>
                <option value="co2">CO2</option>
                <option value="temp">Temperature</option>
              </select>
              <Icon id="arrowDownSlimIcon" width="10" height="7" />
            </div>
            <div className={styles.modal__field}>
              <label htmlFor="publicMetrics">Public metrics</label>
              <select
                className={styles.modal__input}
                name="publicMetrics"
                id="publicMetrics"
                value={formData.publicMetrics}
                onChange={handleInputChange}
              >
                <option value="">Select metrics</option>
                <option value="pm2_5">PM2.5</option>
                <option value="co2">CO2</option>
                <option value="temp">Temperature</option>
              </select>
              <Icon id="arrowDownSlimIcon" width="10" height="7" />
            </div>
          </>
        )}
      </div>
    </form>
  );
}
