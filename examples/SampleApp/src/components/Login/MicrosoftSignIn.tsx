import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import auth from '@react-native-firebase/auth';
import MicrosoftLogo from '../../images/MirosoftLogo';

export const MicrosoftSignIn: React.FC = () => {
  const onMicrosoftButtonPress = async () => {
    // Generate the provider object
    const provider = new auth.OAuthProvider('microsoft.com');
    // Optionally add scopes
    // provider.addScope('offline_access');
    // // Optionally add custom parameters
    // provider.setCustomParameters({
    //   prompt: 'consent',
    //   // Optional "tenant" parameter for optional use of Azure AD tenant.
    //   // e.g., specific ID - 9aaa9999-9999-999a-a9aa-9999aa9aa99a or domain - example.com
    //   // defaults to "common" for tenant-independent tokens.
    //   tenant: 'tenant_name_or_id',
    // });

    // Sign-in the user with the provider
    return auth().signInWithRedirect(provider);
  };
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => onMicrosoftButtonPress().then(() => console.log('Signed in with Microsoft!'))}
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
