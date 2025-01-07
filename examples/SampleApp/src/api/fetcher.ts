import axios, { InternalAxiosRequestConfig } from 'axios';

import { extractApiError } from '../utils/error.util';
import { ApiError } from '../model';
import { firebase } from '../utils/firebase.util';

const URI = {
  // API: 'http://192.168.1.175:8080',
  // LEGACY_API: 'http://192.168.1.175:8080/api',
  API: 'https://dev.api.vendorpm.com',
  LEGACY_API: 'https://dev.api.vendorpm.com/api',
};

// intercept and modify out going requests
const requestInterceptor = async (config: InternalAxiosRequestConfig) => {
  const token = await firebase.getUserToken();
  config.headers.set('authorization', token);
  config.headers.set('Origin', 'https://dev.vendorpm.com');
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
  baseURL: URI.API,
  withCredentials: true,
});

const legacyApi = axios.create({
  baseURL: URI.LEGACY_API,
  withCredentials: true,
});

if (__DEV__) {
  api.interceptors.request.use((config) => {
    console.log(
      '🪐',
      `Request: ${config.method?.toUpperCase()} ${config.url}, 
      params: ${JSON.stringify(config.params)}, 
      data: ${JSON.stringify(config.data)}`,
    );
    return config;
  });
  legacyApi.interceptors.request.use((config) => {
    console.log(
      '🪐',
      `Request: ${config.method?.toUpperCase()} ${config.url}, 
      params: ${JSON.stringify(config.params)}, 
      data: ${JSON.stringify(config.data)}`,
    );
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
