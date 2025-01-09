import auth from '@react-native-firebase/auth';
import { initializeApp } from 'firebase/app';

export const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyDCGovJcNbuiD3AYsvIh4YolmwjGEhTt4U',
  appId: '1:525818996174:ios:b3475d12e4aecd3e33b79f',
  authDomain: 'vendorpm-dev.firebaseapp.com',
  measurementId: 'G-7XH9QX91TB',
  messagingSenderId: '525818996174',
  projectId: 'vendorpm-dev',
  storageBucket: 'vendorpm-dev.firebasestorage.app',
};

const initialize = () => initializeApp(FIREBASE_CONFIG);

const getUserToken = (): Promise<string> =>
  new Promise((resolve) =>
    auth().onIdTokenChanged(async (user) => {
      if (!user) {
        return resolve('');
      }

      const token = await user?.getIdToken();

      resolve(token);
    }),
  );

export const firebase = {
  getUserToken,
  initialize,
};
