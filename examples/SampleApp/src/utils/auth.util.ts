import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import AsyncStore from './AsyncStore';

type LoginValue = {
  email: string;
  password: string;
  rememberMe?: boolean;
};
export class Authentication {
  static login = ({ email, password, rememberMe }: LoginValue) => {
    AsyncStore.removeItem('email');

    if (rememberMe) {
      AsyncStore.setItem('email', email);
    }

    return signInWithEmailAndPassword(getAuth(), email, password);
  };

  static unauthenticate = async () => {
    await getAuth().signOut();

    await AsyncStore.clear();
  };

  static logout = async (resetAnalytics?: () => Promise<void> | undefined, redirect?: string) => {
    try {
      await this.unauthenticate();

      if (resetAnalytics) {
        resetAnalytics();
      }
    } catch (err) {
      console.log('getAuth().signOut() ->', err);
    } finally {
      console.log('getAuth().signOut() ->', err);
    }
  };
}
