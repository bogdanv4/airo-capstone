export const MAP_STYLE_URL = `https://api.maptiler.com/maps/01993d9d-f8af-7979-a2e2-6b3ce864642a/style.json?key=${import.meta.env.VITE_MAPTILER_API_KEY}`;

export const CORDS_TO_LOCATION_BASE_URL = `https://nominatim.openstreetmap.org/reverse`;

export const API_BASE_URL = 'http://localhost:3000';
export const AUTH_URL = `${API_BASE_URL}/auth/google/url`;
export const VERIFY_TOKEN_URL = `${API_BASE_URL}/auth/verify`;
export const LOGOUT_URL = `${API_BASE_URL}/auth/logout`;
