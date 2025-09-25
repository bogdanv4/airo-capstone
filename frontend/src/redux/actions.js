export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

export const OPEN_USER_PANEL = 'OPEN_USER_PANEL';
export const CLOSE_USER_PANEL = 'CLOSE_USER_PANEL';

export const OPEN_MODAL = 'OPEN_MODAL';
export const CLOSE_MODAL = 'CLOSE_MODAL';

export const login = (user, token) => ({
  type: 'LOGIN',
  payload: { user, token },
});

export const logout = () => ({
  type: 'LOGOUT',
});

export const openUserPanel = () => ({ type: OPEN_USER_PANEL });
export const closeUserPanel = () => ({ type: CLOSE_USER_PANEL });

export const openModal = () => ({ type: OPEN_MODAL });
export const closeModal = () => ({ type: CLOSE_MODAL });
