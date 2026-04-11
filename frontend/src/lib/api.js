import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Secure token retrieval from sessionStorage
const getAuthToken = () => sessionStorage.getItem('access_token');

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Products API
export const productsApi = {
  getAll: async (category = null, featured = null) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (featured !== null) params.append('featured', featured);
    const response = await axios.get(`${API}/products?${params.toString()}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await axios.get(`${API}/products/${id}`);
    return response.data;
  },

  create: async (product) => {
    const response = await axios.post(`${API}/products`, product, {
      headers: getAuthHeaders(),
      withCredentials: true
    });
    return response.data;
  },

  update: async (id, product) => {
    const response = await axios.put(`${API}/products/${id}`, product, {
      headers: getAuthHeaders(),
      withCredentials: true
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await axios.delete(`${API}/products/${id}`, {
      headers: getAuthHeaders(),
      withCredentials: true
    });
    return response.data;
  }
};

// Categories API
export const categoriesApi = {
  getAll: async () => {
    const response = await axios.get(`${API}/categories`);
    return response.data;
  }
};

// Contact API
export const contactApi = {
  submit: async (data) => {
    const response = await axios.post(`${API}/contact`, data);
    return response.data;
  },

  getAll: async () => {
    const response = await axios.get(`${API}/contacts`, {
      headers: getAuthHeaders(),
      withCredentials: true
    });
    return response.data;
  }
};

// WhatsApp Helper
export const generateWhatsAppLink = (productName, productCategory) => {
  const phone = '919544982471';
  const message = encodeURIComponent(
    `Hello Stonic Export!\n\nI am interested in:\n*Product:* ${productName}\n*Category:* ${productCategory}\n\nPlease share more details about pricing and availability.`
  );
  return `https://wa.me/${phone}?text=${message}`;
};

// Format error messages
export const formatApiError = (error) => {
  const detail = error?.response?.data?.detail;
  if (detail == null) return 'Something went wrong. Please try again.';
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    return detail.map(e => (e && typeof e.msg === 'string' ? e.msg : JSON.stringify(e))).filter(Boolean).join(' ');
  }
  if (detail && typeof detail.msg === 'string') return detail.msg;
  return String(detail);
};
