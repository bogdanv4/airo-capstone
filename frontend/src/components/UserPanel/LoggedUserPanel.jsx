import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './userPanel.module.css';
import {
  openModal,
  closeUserPanel,
  fetchUserData,
  openDevicePanel,
  selectDevice,
} from 'src/redux/actions';
import { useAuth } from 'src/hooks/useAuth';
import { useBatchGeocode } from 'src/hooks/useBatchGeocode';
import { PRIVACY_POLICY_URL } from 'src/constants/const';
import DeviceCard from 'src/components/DeviceCard/DeviceCard';
import Button from 'src/components/Button/Button';

export default function LoggedUserPanel() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const userPanelOpen = useSelector((state) => state.userPanel.isOpen);
  const { devices, gateways, loading, error } = useSelector(
    (state) => state.data,
  );
  const { logout } = useAuth();

  useEffect(() => {
    if (user?.sub) {
      dispatch(fetchUserData(user.sub));
    }
  }, [dispatch, user?.sub]);

  const allLocations = [
    ...gateways.map((gateway) => gateway.location),
    ...devices.map((device) => device.location),
  ].filter(Boolean);

  const { getAddress, loading: geocodingLoading } =
    useBatchGeocode(allLocations);

  const handleDeviceClick = (device, type) => {
    const deviceWithAddress = {
      ...device,
      type,
      address: geocodingLoading
        ? 'Loading address...'
        : getAddress(device.location.lat, device.location.lng),
    };
    dispatch(openDevicePanel(deviceWithAddress));
    dispatch(selectDevice(device));
  };

  const handlePrivacy = () => {
    window.open(PRIVACY_POLICY_URL, '_blank');
  };

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
                onClick={() => handleDeviceClick(gateway, 'gateway')}
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
                onClick={() => handleDeviceClick(device, 'device')}
              />
            ))}

            {devices.length === 0 && gateways.length === 0 && (
              <p>No devices or gateways found</p>
            )}
          </>
        )}
      </div>
      <button
        className={styles.panel__addNewDevice}
        onClick={() => {
          dispatch(openModal());
          dispatch(closeUserPanel());
        }}
      >
        + Add new
      </button>

      <div className={styles.panel__buttons}>
        <Button
          icon={{
            id: 'privacyIcon',
            width: '19',
            height: '22',
          }}
          onClick={handlePrivacy}
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
