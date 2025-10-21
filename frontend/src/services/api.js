import { API_BASE_URL } from 'src/constants/const.js';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('access_token');
};

// Helper function for fetch requests
async function fetchApi(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Device API
export const deviceApi = {
  // Get all devices
  getAll: async () => {
    return fetchApi('/devices');
  },

  // Get devices by user ID
  getByUserId: async (userId) => {
    return fetchApi(`/devices/${userId}`);
  },

  // Create new device
  create: async (deviceData) => {
    return fetchApi('/device', {
      method: 'POST',
      body: JSON.stringify(deviceData),
    });
  },
};

// Gateway API
export const gatewayApi = {
  // Get all gateways
  getAll: async () => {
    return fetchApi('/gateways');
  },

  // Get gateways by user ID
  getByUserId: async (userId) => {
    return fetchApi(`/gateways/${userId}`);
  },

  // Create new gateway
  create: async (gatewayData) => {
    return fetchApi('/gateway', {
      method: 'POST',
      body: JSON.stringify(gatewayData),
    });
  },
};

// Combined API
export const combinedApi = {
  // Get all devices and gateways by user ID
  getAllByUserId: async (userId) => {
    return fetchApi(`/all/${userId}`);
  },
};
