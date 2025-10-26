import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, ZoomControl } from 'react-leaflet';
import styles from './map.module.css';
import { useBatchGeocode } from 'src/hooks/useBatchGeocode';
import { fetchUserData } from 'src/redux/actions';
import CenterButton from 'src/components/CenterButton/CenterButton';
import MapTiler from './MapTiler';
import DevicePopup from './DevicePopup';
import greenIcon from 'src/assets/icons/greenMapIcon';
import yellowIcon from 'src/assets/icons/yellowMapIcon';
import redIcon from 'src/assets/icons/redMapIcon';
import {
  getAirQualityColor,
  updateDeviceAirQuality,
} from 'src/utility/airQuality';

const iconsMap = {
  green: greenIcon,
  yellow: yellowIcon,
  red: redIcon,
};

export default function Map() {
  const dispatch = useDispatch();
  const signedIn = useSelector((state) => state.auth.signedIn);
  const user = useSelector((state) => state.auth.user);
  const { devices, gateways, loading, error } = useSelector(
    (state) => state.data,
  );

  const [{ latitude, longitude }, setCords] = useState({});
  const [devicePM25Values, setDevicePM25Values] = useState({});

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCords({ latitude, longitude });
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
    getUserLocation();
  }, []);

  useEffect(() => {
    if (signedIn && user?.sub) {
      dispatch(fetchUserData(user.sub));
    }
  }, [dispatch, signedIn, user?.sub]);

  const handleAirQualityUpdate = async (deviceId, pm25) => {
    setDevicePM25Values((prev) => ({
      ...prev,
      [deviceId]: pm25,
    }));

    try {
      await updateDeviceAirQuality(deviceId, pm25);
    } catch (error) {
      console.error('❌ Failed to save PM2.5 to database:', error);
    }
  };

  const allDevices = [...devices, ...gateways];

  const deviceLocations = allDevices
    .filter((device) => device.location)
    .map((device) => device.location);

  const { getAddress, loading: geocodingLoading } =
    useBatchGeocode(deviceLocations);

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
          if (!device.location) {
            return null;
          }

          const address = getAddress(device.location.lat, device.location.lng);

          const pm25 = devicePM25Values[device.id] ?? device.pm25;
          const airQuality = getAirQualityColor(pm25);

          return (
            <Marker
              key={device.id}
              position={[device.location.lat, device.location.lng]}
              icon={iconsMap[airQuality]}
            >
              <Popup>
                <DevicePopup
                  device={device}
                  address={address}
                  lat={device.location.lat}
                  lng={device.location.lng}
                  isLoading={geocodingLoading}
                  onAirQualityUpdate={handleAirQualityUpdate}
                />
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
