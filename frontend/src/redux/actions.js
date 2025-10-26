import { deviceApi, gatewayApi, combinedApi } from 'src/services/api';

export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

export const OPEN_USER_PANEL = 'OPEN_USER_PANEL';
export const CLOSE_USER_PANEL = 'CLOSE_USER_PANEL';

export const OPEN_MODAL = 'OPEN_MODAL';
export const CLOSE_MODAL = 'CLOSE_MODAL';

export const FETCH_USER_DATA_REQUEST = 'FETCH_USER_DATA_REQUEST';
export const FETCH_USER_DATA_SUCCESS = 'FETCH_USER_DATA_SUCCESS';
export const FETCH_USER_DATA_FAILURE = 'FETCH_USER_DATA_FAILURE';

export const ADD_DEVICE_SUCCESS = 'ADD_DEVICE_SUCCESS';
export const ADD_GATEWAY_SUCCESS = 'ADD_GATEWAY_SUCCESS';

export const login = (user, token) => ({
  type: LOGIN,
  payload: { user, token },
});

export const logout = () => ({
  type: LOGOUT,
});

export const openUserPanel = () => ({ type: OPEN_USER_PANEL });
export const closeUserPanel = () => ({ type: CLOSE_USER_PANEL });

export const openModal = () => ({ type: OPEN_MODAL });
export const closeModal = () => ({ type: CLOSE_MODAL });

export const fetchUserData = (userId) => async (dispatch) => {
  dispatch({ type: FETCH_USER_DATA_REQUEST });

  try {
    const data = await combinedApi.getAllByUserId(userId);
    dispatch({
      type: FETCH_USER_DATA_SUCCESS,
      payload: data,
    });
    return data;
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    dispatch({
      type: FETCH_USER_DATA_FAILURE,
      payload: error.message,
    });
    throw error;
  }
};

export const addDevice = (deviceData) => async (dispatch) => {
  const response = await deviceApi.create(deviceData);
  dispatch({
    type: ADD_DEVICE_SUCCESS,
    payload: response.device,
  });
  return response;
};

export const addGateway = (gatewayData) => async (dispatch) => {
  const response = await gatewayApi.create(gatewayData);
  dispatch({
    type: ADD_GATEWAY_SUCCESS,
    payload: response.gateway,
  });
  return response;
};

export const updateDeviceAirQualityAction =
  (deviceId, pm25) => async (dispatch) => {
    try {
      const response = await fetch(`/api/devices/${deviceId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pm25 }),
      });

      if (!response.ok) {
        throw new Error('Failed to update device air quality');
      }

      const updatedDevice = await response.json();

      console.log('Device air quality updated:', updatedDevice);

      dispatch({
        type: 'UPDATE_DEVICE_AIR_QUALITY',
        payload: { deviceId, pm25 },
      });
    } catch (error) {
      console.error('Error updating device air quality:', error);
    }
  };
