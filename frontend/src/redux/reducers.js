import {
  LOGIN,
  LOGOUT,
  OPEN_MODAL,
  CLOSE_MODAL,
  CLOSE_USER_PANEL,
  OPEN_USER_PANEL,
} from 'src/redux/actions';

const initialAuthState = {
  user: {},
  token: null,
  signedIn: false,
};

const initialUserPanelState = { isOpen: false };

const initialModalState = { isOpen: false };

export const authReducer = (state = initialAuthState, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        signedIn: true,
      };

    case LOGOUT:
      return {
        ...state,
        user: {},
        token: null,
        signedIn: false,
      };

    default:
      return state;
  }
};

export const userPanelReducer = (state = initialUserPanelState, action) => {
  switch (action.type) {
    case OPEN_USER_PANEL:
      return { ...state, isOpen: true };
    case CLOSE_USER_PANEL:
      return { ...state, isOpen: false };
    default:
      return state;
  }
};

export const modalReducer = (state = initialModalState, action) => {
  switch (action.type) {
    case OPEN_MODAL:
      return { ...state, isOpen: true };
    case CLOSE_MODAL:
      return { ...state, isOpen: false };
    default:
      return state;
  }
};
