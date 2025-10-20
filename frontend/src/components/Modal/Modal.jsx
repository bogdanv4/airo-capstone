// import { useEffect, useRef, useState } from 'react';
// import { createPortal } from 'react-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import styles from './modal.module.css';
// import { closeModal } from 'src/redux/actions';
// import Device from 'src/components/Modal/Device';
// import Gateway from 'src/components/Modal/Gateway';
// import Icon from 'src/components/Icon/Icon';
// import Button from 'src/components/Button/Button';

// export default function Modal() {
//   const [activeTab, setActiveTab] = useState('gateway');
//   const dispatch = useDispatch();
//   const isOpen = useSelector((state) => state.modal.isOpen);

//   const dialogRef = useRef(null);

//   useEffect(() => {
//     const dialog = dialogRef.current;
//     if (!dialog) {
//       return;
//     }

//     if (isOpen && !dialog.open) {
//       dialog.showModal();
//     } else if (!isOpen && dialog.open) {
//       dialog.close();
//     }
//   }, [isOpen]);

//   return createPortal(
//     <dialog
//       ref={dialogRef}
//       className={styles.modal}
//       onClose={() => dispatch(closeModal())}
//     >
//       <button className={styles.close} onClick={() => dispatch(closeModal())}>
//         <Icon id="xIcon" width="13" height="13" />
//       </button>
//       <h1 className={styles.modal__heading}>Add new</h1>
//       <div className={styles.modal__buttons}>
//         <Button
//           className={`${styles.modal__button} ${
//             activeTab === 'gateway'
//               ? styles['modal__button--active']
//               : styles['modal__button--inactive']
//           }`}
//           onClick={() => setActiveTab('gateway')}
//         >
//           Gateway
//         </Button>
//         <Button
//           className={`${styles.modal__button} ${
//             activeTab === 'device'
//               ? styles['modal__button--active']
//               : styles['modal__button--inactive']
//           }`}
//           onClick={() => setActiveTab('device')}
//         >
//           Device
//         </Button>
//       </div>
//       {activeTab === 'gateway' ? <Gateway /> : <Device />}
//       <div
//         className={`${styles.modal__buttons} ${styles['modal__buttons--big']}`}
//       >
//         <Button
//           className={`${styles.modal__button} ${styles.modal__bigButton} ${styles['modal__bigButton--confirm']}`}
//         >
//           Add {activeTab === 'gateway' ? 'gateway' : 'device'}
//         </Button>
//         <Button
//           className={`${styles.modal__button} ${styles.modal__bigButton} ${styles['modal__bigButton--cancel']}`}
//           onClick={() => dispatch(closeModal())}
//         >
//           Cancel
//         </Button>
//       </div>
//     </dialog>,
//     document.getElementById('root'),
//   );
// }

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import styles from './modal.module.css';
import { closeModal } from 'src/redux/actions';
import Device from 'src/components/Modal/Device';
import Gateway from 'src/components/Modal/Gateway';
import Icon from 'src/components/Icon/Icon';
import Button from 'src/components/Button/Button';
import { deviceApi, gatewayApi } from 'src/services/api';

export default function Modal() {
  const [activeTab, setActiveTab] = useState('gateway');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.modal.isOpen);

  const dialogRef = useRef(null);
  const deviceFormRef = useRef(null);
  const gatewayFormRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  const handleDeviceSubmit = async (deviceData) => {
    try {
      setLoading(true);
      const response = await deviceApi.create(deviceData);
      console.log('Device created:', response);
      alert('Device added successfully!');
      dispatch(closeModal());
      // Optionally refresh the device list here
      // You might want to dispatch a Redux action to update the state
    } catch (error) {
      console.error('Failed to create device:', error);
      alert(error.message || 'Failed to add device. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGatewaySubmit = async (gatewayData) => {
    try {
      setLoading(true);
      const response = await gatewayApi.create(gatewayData);
      console.log('Gateway created:', response);
      alert('Gateway added successfully!');
      dispatch(closeModal());
      // Optionally refresh the gateway list here
      // You might want to dispatch a Redux action to update the state
    } catch (error) {
      console.error('Failed to create gateway:', error);
      alert(error.message || 'Failed to add gateway. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    // Trigger form submission
    if (activeTab === 'device' && deviceFormRef.current) {
      const form = deviceFormRef.current.querySelector('form');
      form?.requestSubmit();
    } else if (activeTab === 'gateway' && gatewayFormRef.current) {
      const form = gatewayFormRef.current.querySelector('form');
      form?.requestSubmit();
    }
  };

  return createPortal(
    <dialog
      ref={dialogRef}
      className={styles.modal}
      onClose={() => dispatch(closeModal())}
    >
      <button
        className={styles.close}
        onClick={() => dispatch(closeModal())}
        disabled={loading}
      >
        <Icon id="xIcon" width="13" height="13" />
      </button>
      <h1 className={styles.modal__heading}>Add new</h1>
      <div className={styles.modal__buttons}>
        <Button
          className={`${styles.modal__button} ${
            activeTab === 'gateway'
              ? styles['modal__button--active']
              : styles['modal__button--inactive']
          }`}
          onClick={() => setActiveTab('gateway')}
          disabled={loading}
        >
          Gateway
        </Button>
        <Button
          className={`${styles.modal__button} ${
            activeTab === 'device'
              ? styles['modal__button--active']
              : styles['modal__button--inactive']
          }`}
          onClick={() => setActiveTab('device')}
          disabled={loading}
        >
          Device
        </Button>
      </div>
      {activeTab === 'gateway' ? (
        <div ref={gatewayFormRef}>
          <Gateway onSubmit={handleGatewaySubmit} />
        </div>
      ) : (
        <div ref={deviceFormRef}>
          <Device onSubmit={handleDeviceSubmit} />
        </div>
      )}
      <div
        className={`${styles.modal__buttons} ${styles['modal__buttons--big']}`}
      >
        <Button
          className={`${styles.modal__button} ${styles.modal__bigButton} ${styles['modal__bigButton--confirm']}`}
          onClick={handleConfirm}
          disabled={loading}
        >
          {loading
            ? 'Adding...'
            : `Add ${activeTab === 'gateway' ? 'gateway' : 'device'}`}
        </Button>
        <Button
          className={`${styles.modal__button} ${styles.modal__bigButton} ${styles['modal__bigButton--cancel']}`}
          onClick={() => dispatch(closeModal())}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </dialog>,
    document.getElementById('root'),
  );
}
