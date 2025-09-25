import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import styles from './modal.module.css';
import { closeModal } from 'src/redux/actions';
import Device from 'src/components/Modal/Device';
import Gateway from 'src/components/Modal/Gateway';
import Icon from 'src/components/Icon/Icon';
import Button from 'src/components/Button/Button';

export default function Modal() {
  const [activeTab, setActiveTab] = useState('gateway');
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.modal.isOpen);

  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  return createPortal(
    <dialog
      ref={dialogRef}
      className={styles.modal}
      onClose={() => dispatch(closeModal())}
    >
      <button className={styles.close} onClick={() => dispatch(closeModal())}>
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
        >
          Device
        </Button>
      </div>
      {activeTab === 'gateway' ? <Gateway /> : <Device />}
      <div
        className={`${styles.modal__buttons} ${styles['modal__buttons--big']}`}
      >
        <Button
          className={`${styles.modal__button} ${styles.modal__bigButton} ${styles['modal__bigButton--confirm']}`}
        >
          Add {activeTab === 'gateway' ? 'gateway' : 'device'}
        </Button>
        <Button
          className={`${styles.modal__button} ${styles.modal__bigButton} ${styles['modal__bigButton--cancel']}`}
          onClick={() => dispatch(closeModal())}
        >
          Cancel
        </Button>
      </div>
    </dialog>,
    document.getElementById('root'),
  );
}
