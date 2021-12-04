import { initReactQueryAuth } from 'react-query-auth';
import userAPI, { User } from '../api/user';
import jwt_decode from 'jwt-decode';
import axios from '../api/axios';
import JSCookies from 'js-cookie';

const storage = {
  getToken: () => {
    if (typeof window === 'undefined') return '';
    return JSON.parse(window.localStorage.getItem('token'));
  },
  setToken: token => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('token', JSON.stringify(token));
  },
  clearToken: () => {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem('token');
  },
};

export async function handleUserResponse(data) {
  const user = jwt_decode<User>(data);
  user.token = data;
  storage.setToken(data);
  JSCookies.set('access_token', data);
  axios.defaults.headers.common['Authorization'] = `Bearer ${data}`;

  return user;
}

export async function loadUser(): Promise<User | null> {
  let user = null;
  const token = storage.getToken();
  if (token) {
    const data = jwt_decode<User>(token);
    user = data;
    user.token = token;
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    JSCookies.set('access_token', token);
  }
  return user;
}

async function loginFn(data) {
  const response = await userAPI.login(data.email, data.password);
  const user = await handleUserResponse(response);
  return user;
}

async function registerFn(data) {
  const response = await userAPI.register(data.name, data.email, data.password);
  const user = await handleUserResponse(response);
  return user;
}

export async function logoutFn() {
  delete axios.defaults.headers.common['Authorization'];
  JSCookies.set('access_token');
  try {
    const token = storage.getToken();
    const user = jwt_decode<User>(token);
    await userAPI.logout(user.nameid);
  } catch (error) {}
  storage.clearToken();
}

const authConfig = {
  loadUser,
  loginFn,
  registerFn,
  logoutFn,
};

const { AuthProvider, useAuth } = initReactQueryAuth<User>(authConfig);

export { AuthProvider, useAuth };
