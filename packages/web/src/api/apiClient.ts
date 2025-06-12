import type { AxiosInstance } from 'axios';
import axios from 'axios';

// Create axios instance with correct base URL and credentials
const apiClient: AxiosInstance = axios.create({
  baseURL: '',
  withCredentials: true, // Allow cookies to be sent and received
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;