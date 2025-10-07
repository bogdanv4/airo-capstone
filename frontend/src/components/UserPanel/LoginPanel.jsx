import { useDispatch, useSelector } from 'react-redux';
import styles from './userPanel.module.css';
import { closeUserPanel } from 'src/redux/actions';
import { useAuth } from 'src/hooks/useAuth';
import Icon from 'src/components/Icon/Icon';
import LoginButton from 'src/components/LoginButton/LoginButton';
import logInImage from 'src/assets/images/logIn.svg';

export default function LoginPanel() {
  const dispatch = useDispatch();
  const userPanelOpen = useSelector((state) => state.userPanel.isOpen);
  const { initiateLogin, loading } = useAuth();

  function handleUserPanel() {
    dispatch(closeUserPanel());
  }

  return (
    <div className={`${styles.panel} ${userPanelOpen ? styles.openPanel : ''}`}>
      <div className={styles.panel__user}>
        <div className={styles.panel__settings}>
          <h1 className={styles.panel__userName}>Settings</h1>
          <button onClick={handleUserPanel}>
            <Icon id="xIcon" width="13" height="13" />
          </button>
        </div>
      </div>
      <div
        className={`${styles.panel__centerContent} ${styles['panel__centerContent--small']}`}
      >
        <img src={logInImage} style={{ width: '14rem' }} alt="Login" />
        <div>
          Please Log In via Gmail SSO account to have possibility to manage
          personal devices and recieve notifications.
        </div>
      </div>
      <div className={styles.panel__buttons}>
        <LoginButton onClick={initiateLogin} disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </LoginButton>
      </div>
      <button className={styles.panel__bottom_button}>
        About this application &rarr;
      </button>
    </div>
  );
}
