import axios, { InternalAxiosRequestConfig } from 'axios';
import Config from 'react-native-config';

import { extractApiError } from '../utils/error.util';
import { ApiError } from '../model';
import { firebase } from '../utils/firebase.util';

// intercept and modify out going requests
const requestInterceptor = async (config: InternalAxiosRequestConfig) => {
  const token = await firebase.getUserToken();
  config.headers.set('authorization', token);
  config.headers.set('Origin', Config.CONFIG_HEADER);
  return config;
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
  baseURL: Config.API_URL,
  withCredentials: true,
});

const legacyApi = axios.create({
  baseURL: Config.LEGACY_API_URL,
  withCredentials: true,
});

if (__DEV__) {
  api.interceptors.request.use((config) => {
    return config;
  });
  legacyApi.interceptors.request.use((config) => {
    return config;
  });
}

api.interceptors.request.use(requestInterceptor);
api.interceptors.response.use(undefined, responseErrorInterceptor);

legacyApi.interceptors.request.use(requestInterceptor);
legacyApi.interceptors.response.use(undefined, responseErrorInterceptor);

export const fetcher = {
  api,
  legacyApi,
};
