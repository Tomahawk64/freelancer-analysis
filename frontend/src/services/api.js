import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://freelancer-analysis-backend.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if needed
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.request);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Freelancer API endpoints
export const freelancerAPI = {
  // Get all freelancers
  getAll: (params) => api.get('/freelancers', { params }),
  
  // Get single freelancer
  getById: (id) => api.get(`/freelancers/${id}`),
  
  // Create freelancer
  create: (data) => api.post('/freelancers', data),
  
  // Update freelancer
  update: (id, data) => api.put(`/freelancers/${id}`, data),
  
  // Delete freelancer
  delete: (id) => api.delete(`/freelancers/${id}`),
  
  // Get analytics
  getAnalytics: () => api.get('/freelancers/analytics'),
  
  // Reactivate freelancers
  reactivate: (freelancerIds) => api.post('/freelancers/reactivate', { freelancerIds }),
  
  // Get countries filter
  getCountries: () => api.get('/freelancers/filters/countries'),
  
  // Get skills filter
  getSkills: () => api.get('/freelancers/filters/skills'),
};

// Health check
export const healthCheck = () => api.get('/health');

export default api;
