import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/products`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

export const productApi = {
  getAll: () => axios.get(API_URL, getAuthHeaders()),
  create: (data) => axios.post(API_URL, data, getAuthHeaders()),
  update: (id, data) => axios.put(`${API_URL}/${id}`, data, getAuthHeaders()),
  delete: (id) => axios.delete(`${API_URL}/${id}`, getAuthHeaders())
};