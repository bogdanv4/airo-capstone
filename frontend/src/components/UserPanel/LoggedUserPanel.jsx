import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './userPanel.module.css';
import { openModal, closeUserPanel } from 'src/redux/actions';
import { useAuth } from 'src/hooks/useAuth';
import { useBatchGeocode } from 'src/hooks/useBatchGeocode';
import DeviceCard from 'src/components/DeviceCard/DeviceCard';
import Button from 'src/components/Button/Button';

export default function LoggedUserPanel() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const userPanelOpen = useSelector((state) => state.userPanel.isOpen);
  const { logout } = useAuth();

  const [devices, setDevices] = useState([]);
  const [gateways, setGateways] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDevices = async () => {
      if (!user?.sub) {
        return;
      }

      try {
        setLoading(true);

        const [devicesRes, gatewaysRes] = await Promise.all([
          fetch(`http://localhost:3000/devices/${user.sub}`),
          fetch(`http://localhost:3000/gateways/${user.sub}`),
        ]);

        if (!devicesRes.ok || !gatewaysRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const devicesData = await devicesRes.json();
        const gatewaysData = await gatewaysRes.json();

        setDevices(devicesData);
        setGateways(gatewaysData);
      } catch (err) {
        console.error('Error fetching devices:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDevices();
  }, [user?.sub]);

  const allLocations = [
    ...gateways.map((gateway) => gateway.location),
    ...devices.map((device) => device.location),
  ].filter(Boolean);

  const { getAddress, loading: geocodingLoading } =
    useBatchGeocode(allLocations);

  return (
    <div className={`${styles.panel} ${userPanelOpen ? styles.openPanel : ''}`}>
      <div className={styles.panel__user}>
        <img src={user.picture} alt="Profile" key={user.picture} />
        <div className={styles.panel__text}>
          <h2 className={styles.panel__userName}>{user.name}</h2>
          <h3 className={styles.panel__userMail}>{user.email}</h3>
        </div>
      </div>

      <div className={styles.panel__devices}>
        {loading && <p>Loading devices...</p>}
        {error && <p>Error: {error}</p>}

        {!loading && !error && (
          <>
            {gateways.map((gateway) => (
              <DeviceCard
                key={gateway.id}
                heading={gateway.name}
                address={
                  geocodingLoading
                    ? 'Loading address...'
                    : getAddress(gateway.location.lat, gateway.location.lng)
                }
                icon={{
                  id: 'antennaIcon',
                  width: '28.13',
                  height: '32',
                }}
              />
            ))}

            {devices.map((device) => (
              <DeviceCard
                key={device.id}
                heading={device.name}
                address={
                  geocodingLoading
                    ? 'Loading address...'
                    : getAddress(device.location.lat, device.location.lng)
                }
                icon={{
                  id: 'routerIcon',
                  width: '32',
                  height: '32',
                }}
              />
            ))}

            {devices.length === 0 && gateways.length === 0 && (
              <p>No devices or gateways found</p>
            )}
          </>
        )}

        <button
          className={styles.panel__addNewDevice}
          onClick={() => {
            dispatch(openModal());
            dispatch(closeUserPanel());
          }}
        >
          + Add new
        </button>
      </div>

      <div className={styles.panel__buttons}>
        <Button
          icon={{
            id: 'privacyIcon',
            width: '19',
            height: '22',
          }}
        >
          Privacy
        </Button>
        <Button
          icon={{
            id: 'logoutIcon',
            width: '27',
            height: '18',
          }}
          onClick={logout}
        >
          Log Out
        </Button>
      </div>
    </div>
  );
}
