import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './devicePanel.module.css';
import {
  closeDevicePanel,
  deleteDevice,
  updateDevice,
} from 'src/redux/actions';
import { reverseGeocode } from 'src/utility/geocoding';
import Icon from 'src/components/Icon/Icon';
import Button from 'src/components/Button/Button';
import DeviceMetric from './DeviceMetric';

export default function DevicePanel() {
  const dispatch = useDispatch();
  const { isOpen, selectedDevice } = useSelector((state) => state.devicePanel);
  const [activeTimeRange, setActiveTimeRange] = useState('hour');
  const [address, setAddress] = useState('Loading address...');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => {
    if (isOpen && selectedDevice?._id) {
      setIsLoadingData(true);
      const timer = setTimeout(() => {
        setIsLoadingData(false);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [isOpen, selectedDevice?._id]);

  useEffect(() => {
    if (selectedDevice?.location?.lat && selectedDevice?.location?.lng) {
      reverseGeocode(
        selectedDevice.location.lat,
        selectedDevice.location.lng,
      ).then((addr) => {
        setAddress(addr);
      });
    } else {
      setAddress('Address not available');
    }
  }, [selectedDevice]);

  useEffect(() => {
    setIsEditing(false);
    setEditedName('');
  }, [selectedDevice?._id]);

  if (!isOpen || !selectedDevice) {
    return null;
  }

  const handleClose = () => {
    dispatch(closeDevicePanel());
  };

  const handleEditDevice = () => {
    setIsEditing(true);
    setEditedName(selectedDevice.name);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedName('');
  };

  const handleFinishEdit = async () => {
    if (!editedName.trim()) {
      alert('Device name cannot be empty');
      return;
    }

    if (editedName === selectedDevice.name) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      await dispatch(updateDevice(selectedDevice._id, { name: editedName }));
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update device:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteDevice = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${selectedDevice.name}"?`,
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      await dispatch(deleteDevice(selectedDevice._id));
    } catch (error) {
      console.error('Failed to delete device:', error);
      setIsDeleting(false);
    }
  };

  const handleTimeRangeClick = (range) => {
    setActiveTimeRange(range);
  };

  return (
    <div className={`${styles.panel} ${isOpen ? styles.openPanel : ''}`}>
      <div className={styles.panel__header}>
        <div className={styles.panel__title}>
          {isEditing ? (
            <div className={styles.panel__editMode}>
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className={styles.panel__input}
                autoFocus
                disabled={isSaving}
              />
              <button
                onClick={handleFinishEdit}
                className={styles.panel__finishBtn}
                disabled={isSaving}
              >
                <Icon id="checkIcon" width="14" height="14" />
              </button>
              <button
                onClick={handleCancelEdit}
                className={styles.panel__cancelBtn}
                disabled={isSaving}
              >
                <Icon id="xIcon" width="13" height="13" />
              </button>
            </div>
          ) : (
            <>
              <h2>{selectedDevice.name}</h2>
              <button onClick={handleEditDevice}>
                <Icon id="pencilIcon" width="13" height="13" />
              </button>
            </>
          )}
        </div>
        <button onClick={handleClose} className={styles.panel__closeBtn}>
          <Icon id="xIcon" width="13" height="13" />
        </button>
      </div>

      <div className={styles.panel__info}>
        <Icon id="locationPinMiniIcon" width="12" height="12" />
        <p>{address}</p>
      </div>

      {isLoadingData ? (
        <div className={styles.loadingState}>
          <p>Loading latest data...</p>
        </div>
      ) : (
        <>
          <div className={styles.panel__actions}>
            <Button
              onClick={() => handleTimeRangeClick('hour')}
              className={activeTimeRange === 'hour' ? styles.active : ''}
            >
              Hour
            </Button>
            <Button
              onClick={() => handleTimeRangeClick('today')}
              className={activeTimeRange === 'today' ? styles.active : ''}
            >
              Today
            </Button>
            <Button
              onClick={() => handleTimeRangeClick('week')}
              className={activeTimeRange === 'week' ? styles.active : ''}
            >
              Week
            </Button>
          </div>
          <div className={styles.metrics}>
            <DeviceMetric
              metric="PM2.5"
              normalRange="0-12"
              value={selectedDevice.metrics.pm2_5}
            />
            <DeviceMetric
              metric="CO2"
              normalRange="< 1000"
              value={selectedDevice.metrics.co}
            />
            <DeviceMetric
              metric="Temperature"
              value={selectedDevice.metrics.temp}
            />
            <DeviceMetric
              metric="Humidity"
              normalRange="30-60%"
              value={selectedDevice.metrics.humidity}
            />
          </div>

          <button
            className={styles.deleteDevice}
            onClick={handleDeleteDevice}
            disabled={isDeleting}
          >
            <Icon id="deleteIcon" width="36" height="36" />
            <span>{isDeleting ? 'Deleting...' : 'Remove Device'}</span>
          </button>
        </>
      )}
    </div>
  );
}
