import { useDispatch, useSelector } from 'react-redux';
import styles from './userPanel.module.css';
import { openModal, closeUserPanel } from 'src/redux/actions';
import { useAuth } from 'src/hooks/useAuth';
import DeviceCard from 'src/components/DeviceCard/DeviceCard';
import Button from 'src/components/Button/Button';

export default function LoggedUserPanel() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const userPanelOpen = useSelector((state) => state.userPanel.isOpen);
  const { logout } = useAuth();

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
        <DeviceCard
          heading="Gateway 1"
          address="CA, Venice, 31st treet, 4"
          icon={{
            id: 'antennaIcon',
            width: '32',
            height: '32',
          }}
        />
        <DeviceCard
          heading="Device 2"
          address="CA, Sunnyvale, 42st treet, 51"
          icon={{
            id: 'routerIcon',
            width: '32',
            height: '32',
          }}
        />
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
