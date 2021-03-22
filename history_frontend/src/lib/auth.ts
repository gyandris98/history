import { initReactQueryAuth } from 'react-query-auth';
import userAPI, { IAuthResponse, User } from '../api/user';
import jwt_decode from 'jwt-decode';
import axios from '../api/axios';
import { getCookieParser } from 'next/dist/next-server/server/api-utils';
import JSCookies from 'js-cookie';
import Cookies from 'cookies';

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

export async function handleUserResponseRefresh(data: IAuthResponse) {
  const user = jwt_decode<User>(data.accessToken);
  user.token = data.accessToken;
  storage.setToken(data);
  JSCookies.set('access_token', data.accessToken);
  JSCookies.set('refresh_token', JSON.stringify(data.refreshToken));
  axios.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;

  return user;
}

export async function loadUser(): Promise<User | null> {
  let user = null;
  console.log('Loading user');
  const token = storage.getToken();
  console.log(token);

  if (token) {
    const user = jwt_decode<User>(token.accessToken);
    if (user.exp < Date.now() / 1000) {
      const response = await userAPI.refresh(token.refreshToken, user.nameid);
      if (!response) return user;
      return await handleUserResponseRefresh(response);
    }
    return await handleUserResponse(token);
    // const data = await jwt_decode<User>(token);
    // user = data;
    // user.token = token;
    // axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    // console.log(axios.defaults.headers.common);
    // JSCookies.set('access_token', token);
  }
  return user;
}

async function loginFn(data) {
  /*const response = await userAPI.login(data.email, data.password);
  const user = await handleUserResponse(response);
  return user;*/
  const response = await userAPI.loginRefresh(data.email, data.password);
  const user = await handleUserResponseRefresh(response);
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
  await storage.clearToken();
}

const authConfig = {
  loadUser,
  loginFn,
  registerFn,
  logoutFn,
};

const { AuthProvider, useAuth } = initReactQueryAuth<User>(authConfig);

export { AuthProvider, useAuth };

export function contextAuth(context) {
  const cookies = new Cookies(context.req, context.res);

  const token = cookies.get('access_token');
  const refreshToken = cookies.get('refresh_token');
  try {
    const user = jwt_decode<User>(token);
    // if (user.exp < Date.now() / 1000) {
    //   const res = await userAPI.refresh({ token: refreshToken }, user.nameid);
    //   return {
    //     accessToken: res.accessToken,
    //     refreshToken: res.refreshToken,
    //   };
    // }
    // console.log(refreshToken);
    //const decoded = JSON.parse(refreshToken);
    // if (new Date(decoded.expires) < new Date()) {
    //   throw new Error();
    // }
    return {
      token,
      // refreshToken: {
      //   token: refreshToken,
      // },
    };
  } catch (error) {
    console.log(error);
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
}

export const authOnlyProps = context => {
  const redirect = contextAuth(context);
  if (redirect) return redirect;

  return {
    props: {},
  };
};
