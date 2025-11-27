import axios from 'axios';
const api=import.meta.env.VITE_API_URL
const API_URL = `${api}/products`;
console.log("Data:-",API_URL);

const getAuthHeaders = (isFormData = false) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Authorization': `Bearer ${token}`
  };
  
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  
  return { headers };
};

export const productApi = {
  getAll: () => axios.get(API_URL, getAuthHeaders()),
  create: (data) => {
    const hasImages = data.images && data.images.length > 0;
    return axios.post(API_URL, data, getAuthHeaders(hasImages));
  },
  update: (id, data) => {
    const hasImages = data.images && data.images.length > 0;
    return axios.put(`${API_URL}/${id}`, data, getAuthHeaders(hasImages));
  },
  delete: (id) => axios.delete(`${API_URL}/${id}`, getAuthHeaders())
};