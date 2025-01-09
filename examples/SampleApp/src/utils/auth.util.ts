import auth from '@react-native-firebase/auth';
import AsyncStore from './AsyncStore';

type LoginValue = {
  email: string;
  password: string;
  rememberMe?: boolean;
};
export class Authentication {
  static login = ({ email, password }: LoginValue) => {
    AsyncStore.removeItem('email');

    return auth().signInWithEmailAndPassword(email, password);
  };

  static unauthenticate = async () => {
    await auth().signOut();

    await AsyncStore.clear();
  };

  static logout = async (resetAnalytics?: () => Promise<void> | undefined) => {
    try {
      await this.unauthenticate();

      if (resetAnalytics) {
        resetAnalytics();
      }
    } catch (err) {
      console.log('getAuth().signOut() ->', err);
    } finally {
      console.log('getAuth().signOut() ->');
    }
  };
}
