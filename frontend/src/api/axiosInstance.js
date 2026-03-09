import axios from 'axios';
import tokenService from '../services/token';

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(config => {
  const token = tokenService.getToken();
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

export default axiosInstance;
