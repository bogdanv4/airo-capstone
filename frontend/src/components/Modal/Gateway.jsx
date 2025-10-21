import { useState } from 'react';
import { useSelector } from 'react-redux';
import styles from './modal.module.css';
import { getCurrentLocationAddress } from 'src/utility/geocoding';
import Icon from 'src/components/Icon/Icon';

export default function Gateway({ onSubmit }) {
  const [location, setLocation] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    key: '',
  });

  const userInfo = useSelector((state) => state.auth.user);

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

    if (!formData.name || !formData.key || !location) {
      alert('Please fill in all required fields!');
      return;
    }

    if (!coordinates.lat || !coordinates.lng) {
      alert('Please select a valid location!');
      return;
    }

    const gatewayData = {
      userId: userInfo?.sub,
      name: formData.name,
      key: formData.key,
      location: coordinates,
    };

    onSubmit(gatewayData);
  };

  return (
    <form className={styles.modal__form} onSubmit={handleSubmit}>
      <div
        className={`${styles.modal__column} ${styles['modal__column--full']}`}
      >
        <div className={styles.modal__field}>
          <label htmlFor="name">Gateway's name *</label>
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
        <div className={styles.modal__field}>
          <label htmlFor="key">Key *</label>
          <textarea
            className={styles.modal__input}
            name="key"
            id="key"
            placeholder="Type key"
            value={formData.key}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>
        <div className={styles.modal__field}>
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
    </form>
  );
}
