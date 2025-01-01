import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import auth from '@react-native-firebase/auth';
import MicrosoftLogo from '../../images/MirosoftLogo';

type MicrosoftBtnProps = {
  buttonText?: string;
  onClick: () => void;
  onSignOut?: () => void;
  signOut?: boolean;
};

export const MicrosoftSignIn = ({ onClick }: MicrosoftBtnProps) => {
  const onMicrosoftButtonPress = async () => {
    const provider = new auth.OAuthProvider('microsoft.com');

    return auth().signInWithRedirect(provider);
  };
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => onMicrosoftButtonPress().then(() => onClick())}
    >
      <View style={styles.iconContainer}>
        <MicrosoftLogo />
      </View>
      <Text style={styles.buttonText}>Sign in with Microsoft</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#262626',
    height: 32,
    width: '100%',
    borderRadius: 2,
    marginBottom: 16,
  },
  iconContainer: {
    width: 32,
    height: 32,
    padding: 8,
  },
  buttonText: {
    flex: 1,
    color: 'white',
    textAlign: 'center',
  },
});
