import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'https://chai-aur-review.onrender.com/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(config => {
  // Only set header if cookies not working
  const storedToken = localStorage.getItem("authToken");
  if (storedToken) {
    config.headers.Authorization = `Bearer ${storedToken}`;
  }
  return config;
});