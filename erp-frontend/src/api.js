// erp-frontend/src/api.js
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function request(path, opts = {}) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json();
}

export const api = {
  users: () => request('/users'),
  createUser: (u) => request('/users', { method: 'POST', body: JSON.stringify(u) }),
  products: () => request('/products'),
  createProduct: (p) => request('/products', { method: 'POST', body: JSON.stringify(p) }),
  updateProduct: (id, p) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(p) }),
  deleteProduct: (id) => request(`/products/${id}`, { method: 'DELETE' }),
  sales: () => request('/sales'),
  createSale: (s) => request('/sales', { method: 'POST', body: JSON.stringify(s) }),
  settings: () => request('/settings'),
  updateSettings: (s) => request('/settings', { method: 'PUT', body: JSON.stringify(s) }),
};
