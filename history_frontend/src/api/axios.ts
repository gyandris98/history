import axios from 'axios';
import { loadUser, logoutFn } from '../lib/auth';

const instance = axios.create({});

instance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    console.log(originalRequest);
    if (
      (!error.response?.status || error.response.status === 401) &&
      !originalRequest._retry
    ) {
      const arr = originalRequest.url.split('/');

      if (arr[arr.length - 2] === 'refresh') {
        logoutFn();
        return Promise.reject(error);
      }
      originalRequest._retry = true;
      const user = await loadUser();
      if (!user) return Promise.reject(error);

      return instance(originalRequest);
    }
    logoutFn();
    return Promise.reject(error);
  }
);

export default instance;
