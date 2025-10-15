import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, ZoomControl } from 'react-leaflet';
import styles from './map.module.css';
import CenterButton from 'src/components/CenterButton/CenterButton';
import MapTiler from './MapTiler';
import greenIcon from 'src/assets/icons/greenMapIcon';
import yellowIcon from 'src/assets/icons/yellowMapIcon';
import redIcon from 'src/assets/icons/redMapIcon';
import { useBatchGeocode } from 'src/hooks/useBatchGeocode';

const iconsMap = {
  green: greenIcon,
  yellow: yellowIcon,
  red: redIcon,
};

export default function Map() {
  const signedIn = useSelector((state) => state.auth.signedIn);
  const user = useSelector((state) => state.auth.user);

  const [{ latitude, longitude }, setCords] = useState({});
  const [allDevices, setAllDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCords({ latitude, longitude });
          // setCords({ latitude: 44.8176, longitude: 20.4569 });
        },
        (error) => {
          console.error(error);
          setCords({ latitude: 44.8176, longitude: 20.4569 });
        },
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      setCords({ latitude: 44.8176, longitude: 20.4569 });
    }
  };

  useEffect(() => {
    const fetchAllDevices = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/all');

        if (!response.ok) {
          throw new Error('Failed to fetch devices');
        }

        const data = await response.json();
        setAllDevices(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching devices:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (signedIn) {
      fetchAllDevices();
    }
  }, [signedIn]);

  const deviceLocations = allDevices
    .filter((device) => device.location)
    .map((device) => device.location);

  const { getAddress, loading: geocodingLoading } =
    useBatchGeocode(deviceLocations);

  useEffect(() => {
    getUserLocation();
  }, []);

  if (!latitude || !longitude) {
    return null;
  }

  const devicesToShow =
    signedIn && user?.sub
      ? allDevices.filter((device) => device.userId === user.sub)
      : allDevices;

  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={15}
      scrollWheelZoom={true}
      zoomControl={false}
      className={styles.mapContainer}
    >
      <MapTiler />
      <ZoomControl position="bottomright" />
      <CenterButton latitude={latitude} longitude={longitude} />
      <Marker position={[latitude, longitude]}>
        <Popup>You are here.</Popup>
      </Marker>

      {signedIn &&
        !loading &&
        !error &&
        devicesToShow.map((device) => {
          if (!device.location) return null;

          const address = geocodingLoading
            ? 'Loading address...'
            : getAddress(device.location.lat, device.location.lng);

          const airQuality = device.airQuality || 'green';

          return (
            <Marker
              key={device.id}
              position={[device.location.lat, device.location.lng]}
              icon={iconsMap[airQuality]}
            >
              <Popup>
                <div className={styles.popupContent}>
                  <strong>{device.name}</strong>
                  <br />
                  <span style={{ fontSize: '0.9em', color: '#666' }}>
                    {device.type === 'gateway' ? '📡 Gateway' : '📟 Device'}
                  </span>
                  <br />
                  {device.description && (
                    <>
                      <span style={{ fontSize: '0.85em' }}>
                        {device.description}
                      </span>
                      <br />
                    </>
                  )}
                  <span style={{ fontSize: '0.85em' }}>{address}</span>
                  {device.metrics && (
                    <>
                      <br />
                      <div style={{ marginTop: '8px', fontSize: '0.85em' }}>
                        <div>🌡️ {device.metrics.temp}°C</div>
                        <div>💨 PM2.5: {device.metrics.pm2_5} μg/m³</div>
                        <div>🫧 CO₂: {device.metrics.co2} ppm</div>
                      </div>
                    </>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}

      {signedIn && loading && (
        <div className={styles.mapOverlay}>
          <p>Loading devices...</p>
        </div>
      )}

      {signedIn && error && (
        <div className={styles.mapOverlay}>
          <p>Error loading devices: {error}</p>
        </div>
      )}
    </MapContainer>
  );
}
