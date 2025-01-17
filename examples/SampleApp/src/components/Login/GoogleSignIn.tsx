import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin, SignInSuccessResponse } from '@react-native-google-signin/google-signin';
import GoogleLogo from '../../images/GoogleLogo';

type GoogleBtnProps = {
  buttonText?: string;
  onClick: () => void;
  onSignOut?: () => void;
  signOut?: boolean;
};

export const GoogleSignIn = ({ onClick }: GoogleBtnProps) => {
  async function onGoogleButtonPress() {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const signInResult = (await GoogleSignin.signIn()) as SignInSuccessResponse;

      let idToken: string | undefined = (signInResult as any).idToken || signInResult.data?.idToken;

      if (!idToken) {
        throw new Error('No ID token found');
      }

      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userCredential = await auth().signInWithCredential(googleCredential);

      return userCredential;
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      throw error; // Re-throw the error to be handled by the caller
    }
  }

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => onGoogleButtonPress().then(() => onClick())}
    >
      <View style={styles.iconContainer}>
        <GoogleLogo />
      </View>
      <Text style={styles.buttonText}>Sign in with Google</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4285f4',
    height: 32,
    width: '100%',
    borderRadius: 2,
    marginBottom: 16,
  },
  iconContainer: {
    width: 32,
    height: 32,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#4285f4',
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
    padding: 8,
  },
  buttonText: {
    flex: 1,
    color: 'white',
    textAlign: 'center',
  },
});
