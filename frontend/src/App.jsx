import './index.css';
import { useAuth } from 'src/hooks/useAuth';
import { useOAuthCallback } from 'src/hooks/useOAuthCallback';
import Header from 'src/components/Header/Header';
import UserPanel from 'src/components/UserPanel/UserPanel';
import DevicePanel from 'src/components/DevicePanel/DevicePanel';
import Map from 'src/components/Map/Map';
import Modal from 'src/components/Modal/Modal';

function App() {
  const { loading } = useAuth();
  useOAuthCallback();

  return (
    <>
      <Header loading={loading} />
      <UserPanel loading={loading} />
      <DevicePanel />
      <Map />
      <Modal />
    </>
  );
}

export default App;
