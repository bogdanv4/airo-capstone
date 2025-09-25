import { useDispatch, useSelector } from 'react-redux';
import styles from './header.module.css';
import { openUserPanel, closeUserPanel } from 'src/redux/actions';
import Logo from 'src/components/Logo/Logo';
import Toggle from 'src/components/Toggle/Toggle';
import Icon from 'src/components/Icon/Icon';

export default function Header({ loading }) {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const signedIn = useSelector((state) => state.auth.signedIn);
  const userPanelOpen = useSelector((state) => state.userPanel.isOpen);

  function handleUserPanel() {
    if (userPanelOpen) {
      dispatch(closeUserPanel());
    } else {
      dispatch(openUserPanel());
    }
  }

  return (
    <header className={styles.header}>
      <Logo />
      <div className={styles.header__filters}>
        <Toggle label="Voronoi clasterization" />
        <div className={styles.header__input}>
          <Icon id="filtersIcon" height="13" width="13" />
          <input
            type="text"
            name="searchInput"
            id={styles.searchInput}
            placeholder="Type address..."
          />

          <Icon id="searchIcon" width="14" height="14" />
        </div>
      </div>

      <div className={styles.header__personal}>
        <button className={styles.notification__button}>
          <Icon id="notificationIcon" width="24" height="21" />
        </button>
        <button className={`${styles.person}`} onClick={handleUserPanel}>
          {signedIn && !loading && (
            <>
              <img
                src={user.picture}
                alt="Profile"
                className={styles.person__image}
              />
              <span className={styles.person__name}>{user.given_name}</span>
              <Icon id="arrowDownIcon" width="8" height="5" />
            </>
          )}
          {!signedIn && !loading && (
            <>
              <span className={styles.person__name}>Sign In</span>
              <Icon id="arrowDownIcon" width="8" height="5" />
            </>
          )}
          {loading && <span className="loading">Loading...</span>}
        </button>
      </div>
    </header>
  );
}
