import { useSelector } from 'react-redux';
import LoggedUserPanel from './LoggedUserPanel';
import LoginPanel from './LoginPanel';

export default function UserPanel() {
  const signedIn = useSelector((state) => state.auth.signedIn);

  return (
    <>
      {signedIn && <LoggedUserPanel />}

      {!signedIn && <LoginPanel />}
    </>
  );
}
