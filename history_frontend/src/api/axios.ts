import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { handleUserResponse, logoutFn } from '../lib/auth';
import userAPI, { User } from './user';

const instance = axios.create({});

instance.defaults.withCredentials = true;

instance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (
      (!error.response || error.response?.status === 401) &&
      !originalRequest._retry
    ) {
      const arr = originalRequest.url.split('/');

      if (arr[arr.length - 2] === 'refresh') {
        logoutFn();
        return Promise.reject(error);
      }
      originalRequest._retry = true;
      const access_token = localStorage.getItem('token');
      const user = jwt_decode<User>(access_token);

      const response = await userAPI.refresh(user.nameid);
      const loggedInUser = await handleUserResponse(response);
      if (!loggedInUser) {
        logoutFn();
        return Promise.reject(error);
      }

      return instance(originalRequest);
    }
  }
);

export default instance;
