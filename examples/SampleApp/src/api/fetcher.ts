import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import auth from '@react-native-firebase/auth';

import { extractApiError } from '../utils/error.util';
import { ApiError } from '../model';
import AsyncStorage from '@react-native-async-storage/async-storage';

const COOKIE_KEY = 'connect.sid.development';

const URI = {
  // API: 'http://localhost:8080',
  // LEGACY_API: 'http://localhost:8080/api',

  API: 'http://dev.api.vendorpm.com',
  LEGACY_API: 'http://dev.api.vendorpm.com/api',
};

// intercept and modify out going requests
const requestInterceptor = async (config: InternalAxiosRequestConfig) => {
  const currentUser = auth().currentUser;

  if (currentUser) {
    const token = await currentUser.getIdToken();
    config.headers.set('authorization', token);
  }

  const storedCookie = await AsyncStorage.getItem('authCookie');
  if (storedCookie) {
    config.headers.Cookie = storedCookie;
  }

  return config;
};

// intercept and modify incoming response

const responseInterceptor = async (response: AxiosResponse) => {
  const cookieHeader = response.headers['set-cookie'];
  if (cookieHeader?.includes(COOKIE_KEY)) {
    await AsyncStorage.setItem('authCookie', cookieHeader.join('; '));
  }
  return response;
};

const responseErrorInterceptor = (error: ApiError) => {
  const ERROR = extractApiError(error);

  if (ERROR === 'Invalid session') {
    console.log('Invalid session');
  }

  return Promise.reject({
    ...error,
    ...(typeof ERROR === 'string' ? { message: ERROR } : ERROR),
  });
};

const api = axios.create({
  baseURL: URI.API,
  withCredentials: true,
});

const legacyApi = axios.create({
  baseURL: URI.LEGACY_API,
  withCredentials: true,
});

api.interceptors.request.use(requestInterceptor);
api.interceptors.response.use(responseInterceptor, responseErrorInterceptor);

legacyApi.interceptors.request.use(requestInterceptor);
legacyApi.interceptors.response.use(responseInterceptor, responseErrorInterceptor);

export const fetcher = {
  api,
  legacyApi,
};
