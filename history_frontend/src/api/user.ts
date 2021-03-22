import axios from './axios';
import config from '../config';

export interface User {
  nameid: string;
  unique_name: string;
  email: string;
  token: string;
  role: string;
  exp: number;
}

export interface IAuthResponse {
  accessToken: string;
  refreshToken: {
    token: string;
    expires: string;
    isExpired: boolean;
  };
}

const ENDPOINT = '/auth/';

export async function login(email: string, password: string) {
  const res = await axios.post<string>(config.apiLink + ENDPOINT + 'login', {
    email,
    password,
  });
  return res.data;
}

export async function loginRefresh(email: string, password: string) {
  const res = await axios.post<IAuthResponse>(
    config.apiLink + ENDPOINT + 'refreshlogin',
    {
      email,
      password,
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

export async function refresh(token, id) {
  const res = await axios.post<IAuthResponse>(
    config.apiLink + ENDPOINT + 'refresh/' + id,
    token
  );
  return res.data;
}

const exported = {
  login,
  register,
  loginRefresh,
  refresh,
};

export default exported;
