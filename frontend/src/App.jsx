import './index.css';
import { useAuth } from 'src/hooks/useAuth';
import { useOAuthCallback } from 'src/hooks/useOAuthCallback';
import Header from 'src/components/Header/Header';
import UserPanel from 'src/components/UserPanel/UserPanel';
import Map from 'src/components/Map/Map';
import Modal from 'src/components/Modal/Modal';
import DevicePopup from 'src/components/Map/DevicePopup';

function App() {
  const { loading } = useAuth();
  useOAuthCallback();

  return (
    <>
      <Header loading={loading} />
      <UserPanel loading={loading} />

      <Map />
      {/* <DevicePopup /> */}
      <Modal />
    </>
  );
}

export default App;
