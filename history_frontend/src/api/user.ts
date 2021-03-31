import axios from './axios';
import config from '../config';

export interface User {
  nameid: string;
  unique_name: string;
  email: string;
  token: string;
  role: string;
}

export interface IAuthResponse {
  accessToken: string;
  refreshToken: string;
}

const ENDPOINT = '/auth/';

export async function login(email: string, password: string) {
  const res = await axios.post<IAuthResponse>(
    config.apiLink + ENDPOINT + 'login',
    {
      email,
      password,
    },
    {
      withCredentials: true,
    }
  );
  return res.data;
}

export async function register(name: string, email: string, password: string) {
  const res = await axios.post(config.apiLink + ENDPOINT + 'register', {
    name,
    email,
    password,
  });
  return res.data;
}

export async function refresh(id: string) {
  const res = await axios.get(config.apiLink + ENDPOINT + `refresh/${id}`, {
    withCredentials: true,
  });
  return res.data;
}

export async function logout(id: string) {
  const res = await axios.get(config.apiLink + ENDPOINT + `logout/${id}`, {
    withCredentials: true,
  });
  return res.data;
}

const exported = {
  login,
  register,
  refresh,
  logout,
};

export default exported;
