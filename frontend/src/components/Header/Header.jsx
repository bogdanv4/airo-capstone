import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './header.module.css';
import { openUserPanel, closeUserPanel } from 'src/redux/actions';
import { API_BASE_URL } from 'src/constants/const.js';
import Logo from 'src/components/Logo/Logo';
import Toggle from 'src/components/Toggle/Toggle';
import Icon from 'src/components/Icon/Icon';
import Dropdown from 'src/components/Header/Dropdown';

export default function Header({ loading, onDeviceSelect }) {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [devices, setDevices] = useState([]);

  const user = useSelector((state) => state.auth.user);
  const signedIn = useSelector((state) => state.auth.signedIn);
  const userPanelOpen = useSelector((state) => state.userPanel.isOpen);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/all`);
        const data = await response.json();
        setDevices(data);
      } catch (error) {
        console.error('Error fetching devices:', error);
      }
    };

    fetchDevices();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredDevices([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = devices.filter((device) => {
      const name = device.name?.toLowerCase() || '';
      return name.includes(query);
    });

    setFilteredDevices(filtered);
  }, [searchQuery, devices]);

  function handleUserPanel() {
    if (userPanelOpen) {
      dispatch(closeUserPanel());
    } else {
      dispatch(openUserPanel());
    }
  }

  function handleSearchChange(e) {
    setSearchQuery(e.target.value);
  }

  function handleDeviceSelect(device) {
    onDeviceSelect?.(device);
    setSearchQuery('');
    setFilteredDevices([]);
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
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <Icon id="searchIcon" width="14" height="14" />
        </div>
        {filteredDevices.length > 0 && (
          <Dropdown devices={filteredDevices} onSelect={handleDeviceSelect} />
        )}
      </div>

      <div className={styles.header__personal}>
        <button className={styles.notification__button}>
          <Icon id="notificationIcon" width="24" height="21" />
        </button>
        <button className={`${styles.person}`} onClick={handleUserPanel}>
          {signedIn && !loading && user?.picture && (
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
