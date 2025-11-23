import {
  LOGIN,
  LOGOUT,
  OPEN_MODAL,
  CLOSE_MODAL,
  CLOSE_USER_PANEL,
  OPEN_USER_PANEL,
  OPEN_DEVICE_PANEL,
  CLOSE_DEVICE_PANEL,
  OPEN_ONBOARDING,
  CLOSE_ONBOARDING,
  FETCH_USER_DATA_REQUEST,
  FETCH_USER_DATA_SUCCESS,
  FETCH_USER_DATA_FAILURE,
  ADD_DEVICE_SUCCESS,
  ADD_GATEWAY_SUCCESS,
  DELETE_DEVICE_SUCCESS,
  UPDATE_DEVICE_SUCCESS,
  SELECT_DEVICE,
  CLEAR_SELECTED_DEVICE,
} from 'src/redux/actions';

const initialAuthState = {
  user: {},
  token: null,
  signedIn: false,
};

const initialUserPanelState = { isOpen: false };

const initialDevicePanelState = {
  isOpen: false,
  selectedDevice: null,
};

const initialModalState = { isOpen: false };

const initialOnboardingState = {
  isOpen: false,
};

const initialDataState = {
  devices: [],
  gateways: [],
  loading: false,
  error: null,
};

const initialMapState = {
  selectedDevice: null,
};

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

export const devicePanelReducer = (state = initialDevicePanelState, action) => {
  switch (action.type) {
    case OPEN_DEVICE_PANEL:
      return {
        isOpen: true,
        selectedDevice: action.payload,
      };
    case CLOSE_DEVICE_PANEL:
      return {
        isOpen: false,
        selectedDevice: null,
      };
    case UPDATE_DEVICE_SUCCESS:
      if (
        state.selectedDevice &&
        state.selectedDevice._id === action.payload._id
      ) {
        return {
          ...state,
          selectedDevice: action.payload,
        };
      }
      return state;
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

export const onboardingReducer = (state = initialOnboardingState, action) => {
  switch (action.type) {
    case OPEN_ONBOARDING:
      return { ...state, isOpen: true };
    case CLOSE_ONBOARDING:
      return { ...state, isOpen: false };
    default:
      return state;
  }
};

export const dataReducer = (state = initialDataState, action) => {
  switch (action.type) {
    case FETCH_USER_DATA_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_USER_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        devices: action.payload.filter((item) => item.type === 'device'),
        gateways: action.payload.filter((item) => item.type === 'gateway'),
      };

    case FETCH_USER_DATA_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case ADD_DEVICE_SUCCESS:
      return {
        ...state,
        devices: [...state.devices, action.payload],
      };

    case ADD_GATEWAY_SUCCESS:
      return {
        ...state,
        gateways: [...state.gateways, action.payload],
      };

    case UPDATE_DEVICE_SUCCESS: {
      const isGateway = action.payload.type === 'gateway';

      if (isGateway) {
        return {
          ...state,
          gateways: state.gateways.map((gateway) =>
            gateway._id === action.payload._id ? action.payload : gateway,
          ),
        };
      } else {
        return {
          ...state,
          devices: state.devices.map((device) =>
            device._id === action.payload._id ? action.payload : device,
          ),
        };
      }
    }

    case DELETE_DEVICE_SUCCESS:
      return {
        ...state,
        devices: state.devices.filter(
          (device) => device._id !== action.payload,
        ),
        gateways: state.gateways.filter(
          (gateway) => gateway._id !== action.payload,
        ),
      };

    default:
      return state;
  }
};

export const mapReducer = (state = initialMapState, action) => {
  switch (action.type) {
    case SELECT_DEVICE:
      return {
        ...state,
        selectedDevice: action.payload,
      };

    case CLEAR_SELECTED_DEVICE:
      return {
        ...state,
        selectedDevice: null,
      };

    default:
      return state;
  }
};
