import { useDispatch, useSelector } from 'react-redux';
import styles from './devicePanel.module.css';
import { closeDevicePanel } from 'src/redux/actions';
import Icon from 'src/components/Icon/Icon';
import Button from 'src/components/Button/Button';

export default function DevicePanel() {
  const dispatch = useDispatch();
  const { isOpen, selectedDevice } = useSelector((state) => state.devicePanel);

  if (!isOpen || !selectedDevice) {
    return null;
  }

  const handleClose = () => {
    dispatch(closeDevicePanel());
  };

  return (
    <div className={`${styles.panel} ${isOpen ? styles.openPanel : ''}`}>
      <div className={styles.panel__header}>
        <div className={styles.panel__title}>
          <Icon
            id={
              selectedDevice.type === 'gateway' ? 'antennaIcon' : 'routerIcon'
            }
            width="24"
            height="24"
          />
          <h2>{selectedDevice.name}</h2>
        </div>
        <button onClick={handleClose} className={styles.panel__closeBtn}>
          <Icon id="xIcon" width="13" height="13" />
        </button>
      </div>

      <div className={styles.panel__content}>
        <div className={styles.panel__section}>
          <h3>Device Information</h3>
          <div className={styles.panel__info}>
            <div className={styles.panel__infoRow}>
              <span className={styles.panel__label}>Type:</span>
              <span className={styles.panel__value}>
                {selectedDevice.type === 'gateway' ? 'Gateway' : 'Device'}
              </span>
            </div>
            <div className={styles.panel__infoRow}>
              <span className={styles.panel__label}>ID:</span>
              <span className={styles.panel__value}>{selectedDevice.id}</span>
            </div>
            <div className={styles.panel__infoRow}>
              <span className={styles.panel__label}>Address:</span>
              <span className={styles.panel__value}>
                {selectedDevice.address}
              </span>
            </div>
            {selectedDevice.location && (
              <>
                <div className={styles.panel__infoRow}>
                  <span className={styles.panel__label}>Latitude:</span>
                  <span className={styles.panel__value}>
                    {selectedDevice.location.lat.toFixed(6)}
                  </span>
                </div>
                <div className={styles.panel__infoRow}>
                  <span className={styles.panel__label}>Longitude:</span>
                  <span className={styles.panel__value}>
                    {selectedDevice.location.lng.toFixed(6)}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {selectedDevice.status && (
          <div className={styles.panel__section}>
            <h3>Status</h3>
            <div className={styles.panel__info}>
              <div className={styles.panel__infoRow}>
                <span className={styles.panel__label}>Status:</span>
                <span className={styles.panel__value}>
                  {selectedDevice.status}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={styles.panel__actions}>
        <Button onClick={() => console.log('Edit device', selectedDevice)}>
          Edit Device
        </Button>
        <Button
          onClick={() => console.log('Delete device', selectedDevice)}
          variant="danger"
        >
          Delete Device
        </Button>
      </div>
    </div>
  );
}
