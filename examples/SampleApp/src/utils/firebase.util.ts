import auth from '@react-native-firebase/auth';
import { initializeApp } from 'firebase/app';
import Config from 'react-native-config';

export const FIREBASE_CONFIG = {
  apiKey: Config.API_KEY,
  appId: Config.APP_ID,
  authDomain: Config.AUTH_DOMAIN,
  measurementId: Config.MEASUREMENT_ID,
  messagingSenderId: Config.MESSAGING_SENDER_ID,
  projectId: Config.PROJECT_ID,
  storageBucket: Config.STORAGE_BUCKET,
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
