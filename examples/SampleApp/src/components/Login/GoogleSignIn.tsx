import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import GoogleLogo from '../../images/GoogleLogo';

export const GoogleSignIn: React.FC = () => {
  async function onGoogleButtonPress() {
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      // Get the users ID token
      const signInResult = await GoogleSignin.signIn();
      console.log('signInResult', GoogleSignin.signIn());

      let idToken: string | null | undefined;
      // Try the new style of google-sign in result, from v13+ of that module
      idToken = signInResult.data?.idToken;
      if (!idToken) {
        // if you are using older versions of google-signin, try old style result
        idToken = signInResult.data?.idToken;
      }
      if (!idToken) {
        throw new Error('No ID token found');
      }

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      return auth().signInWithCredential(googleCredential);
    } catch (error) {
      console.log('error', error);
    }
  }

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => onGoogleButtonPress().then(() => console.log('Signed in with Google!'))}
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
