// src/services/api.js
import axios from 'axios';

const API_BASE_URL = '';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 1000,
  headers: {'Content-Type': 'application/json'},
});

export const fetchData = async () => {
  try {
    const response = await apiClient.get('/data');
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
