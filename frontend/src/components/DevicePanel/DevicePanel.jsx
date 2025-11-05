import { useDispatch, useSelector } from 'react-redux';
import styles from './devicePanel.module.css';
import { closeDevicePanel } from 'src/redux/actions';
import Icon from 'src/components/Icon/Icon';
import Button from 'src/components/Button/Button';
import DeviceMetric from './DeviceMetric';

export default function DevicePanel() {
  const dispatch = useDispatch();
  const { isOpen, selectedDevice } = useSelector((state) => state.devicePanel);

  if (!isOpen || !selectedDevice) {
    return null;
  }

  const handleClose = () => {
    dispatch(closeDevicePanel());
  };

  const handleEdit = () => {
    console.log('Edit device', selectedDevice);
  };

  console.log('Selected Device:', selectedDevice);

  return (
    <div className={`${styles.panel} ${isOpen ? styles.openPanel : ''}`}>
      <div className={styles.panel__header}>
        <div className={styles.panel__title}>
          <h2>{selectedDevice.name}</h2>
          <button onClick={handleEdit}>
            <Icon id="pencilIcon" width="13" height="13" />
          </button>
        </div>
        <button onClick={handleClose} className={styles.panel__closeBtn}>
          <Icon id="xIcon" width="13" height="13" />
        </button>
      </div>

      <div className={styles.panel__info}>
        <Icon id="locationPinMiniIcon" width="12" height="12" />
        <p>{'Neka adresa 123'}</p>
      </div>

      <div className={styles.panel__actions}>
        <Button onClick={() => console.log('Hour', selectedDevice)}>
          Hour
        </Button>
        <Button onClick={() => console.log('Today', selectedDevice)}>
          Today
        </Button>
        <Button onClick={() => console.log('Week', selectedDevice)}>
          Week
        </Button>
      </div>
      <div className={styles.metrics}>
        <DeviceMetric
          metric="PM2.5"
          normalRange="1-9"
          value={selectedDevice.metrics.pm2_5}
        />
        <DeviceMetric
          metric="CO2"
          normalRange="< 1000"
          value={selectedDevice.metrics.co2}
        />
        <DeviceMetric
          metric="Temperature"
          value={selectedDevice.metrics.temp}
        />
        <DeviceMetric
          metric="Humidity"
          normalRange="1-9"
          value={selectedDevice.metrics.pm2_5}
        />
      </div>

      <button
        className={styles.deleteDevice}
        onClick={() => console.log('Remove Device', selectedDevice)}
      >
        <Icon id="deleteIcon" width="36" height="36" />
        <span>Remove Device</span>
      </button>
    </div>
  );
}
