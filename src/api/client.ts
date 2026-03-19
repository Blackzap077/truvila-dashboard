import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://backend-production-b055.up.railway.app';

export const api = axios.create({ baseURL: BASE_URL });

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('truvila_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If 401, clear token and redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('truvila_token');
      localStorage.removeItem('truvila_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  },
);

export const authApi = {
  register: (data: { name: string; email: string; password: string; phone?: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
};

export const userApi = {
  me: () => api.get('/users/me'),
  stats: () => api.get('/users/me/stats'),
};

export const smsRoutesApi = {
  list: () => api.get('/sms-routes'),
  updateShortcodes: (key: string, shortcodes: string[], defaultShortcode: string) =>
    api.patch(`/sms-routes/${key}/shortcodes`, { shortcodes, defaultShortcode }),
};

export const smsApi = {
  send: (data: { to: string; message: string; shortcode?: string; token?: string }) =>
    api.post('/sms/send', data),
};

export const webhookApi = {
  events: () => api.get('/webhook/events'),
};

export const dispatchApi = {
  saveReport: (data: {
    routeKey: string;
    shortcode: string;
    message: string;
    results: unknown[];
  }) => api.post('/sms/dispatch-report', data),
};
