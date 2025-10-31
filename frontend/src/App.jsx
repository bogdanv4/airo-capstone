import { useState } from 'react';
import './index.css';
import { useAuth } from 'src/hooks/useAuth';
import { useOAuthCallback } from 'src/hooks/useOAuthCallback';
import Header from 'src/components/Header/Header';
import UserPanel from 'src/components/UserPanel/UserPanel';
import Map from 'src/components/Map/Map';
import Modal from 'src/components/Modal/Modal';

function App() {
  const { loading } = useAuth();
  useOAuthCallback();
  const [selectedDevice, setSelectedDevice] = useState(null);

  const handleDeviceSelect = (device) => {
    setSelectedDevice(device);
  };

  return (
    <>
      <Header loading={loading} onDeviceSelect={handleDeviceSelect} />
      <UserPanel loading={loading} />
      <Map selectedDevice={selectedDevice} />
      <Modal />
    </>
  );
}

export default App;
