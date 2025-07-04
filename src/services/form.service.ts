import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3995/api';

export const fetchForms = async () => {
  const response = await axios.get(`${API_URL}/forms`);
  return response.data;
};

export const createForm = async (formData: any) => {
  const response = await axios.post(`${API_URL}/forms`, formData);
  return response.data;
};

export const updateForm = async (id: string, formData: any) => {
  const response = await axios.put(`${API_URL}/forms/${id}`, formData);
  return response.data;
};

export const deleteForm = async (id: string) => {
  const response = await axios.delete(`${API_URL}/forms/${id}`);
  return response.data;
}; 