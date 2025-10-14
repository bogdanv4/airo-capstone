import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, ZoomControl } from 'react-leaflet';
import styles from './map.module.css';
import CenterButton from 'src/components/CenterButton/CenterButton';
import MapTiler from './MapTiler';
import greenIcon from 'src/assets/icons/greenMapIcon';
import yellowIcon from 'src/assets/icons/yellowMapIcon';
import redIcon from 'src/assets/icons/redMapIcon';

const iconsMap = {
  green: greenIcon,
  yellow: yellowIcon,
  red: redIcon,
};

const mockDevices = [
  //this is mock array, it will be removed once backend is ready
  {
    name: 'gateway1',
    lat: 44.81085285893795,
    long: 20.46839483683915,
    address: 'Crkva Svetog Marka',
    airQuality: 'green',
  },
  {
    name: 'device1',
    lat: 44.81080905458476,
    long: 20.465180047350923,
    address: 'Pionirski Park',
    airQuality: 'yellow',
  },
  {
    name: 'device2',
    lat: 44.80729992989841,
    long: 20.465848508449785,
    address: 'Pored negde',
    airQuality: 'red',
  },
];

export default function Map() {
  const signedIn = useSelector((state) => state.auth.signedIn);

  const [{ latitude, longitude }, setCords] = useState({});
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
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  if (!latitude || !longitude) {
    return null;
  }

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
        mockDevices.map((current) => (
          <Marker
            key={current.name}
            position={[current.lat, current.long]}
            icon={iconsMap[current.airQuality]}
          >
            <Popup>{current.address}</Popup>
          </Marker>
        ))}
    </MapContainer>
  );
}
