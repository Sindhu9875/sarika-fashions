import axios from 'axios'

// Base Axios instance for the future backend.
// The storefront works entirely on mock data/localStorage without this
// running — nothing here is called until the real API exists.
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach an auth token automatically once login is wired to a real backend.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sarika_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const productsApi = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  remove: (id) => api.delete(`/products/${id}`),
}

export const ordersApi = {
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post('/orders', data),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
}

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
}

export default api
