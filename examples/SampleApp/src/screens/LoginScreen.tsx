import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Eye, EyeOff } from 'react-native-feather';
import { KeyboardCompatibleView, useTheme } from 'stream-chat-react-native';

// import CheckBox from '@react-native-community/checkbox';

import { LabeledTextInput } from './AdvancedUserSelectorScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { VendorPmLogo } from '../images/VendorPmLogo';
import { GoogleSignIn } from '../components/Login/GoogleSignIn';
import { MicrosoftSignIn } from '../components/Login/MicrosoftSignIn';
import { UserSelectorScreenNavigationProp } from './UserSelectorScreen';
import CustomDivider from '../components/CustomDivider';
import { fetcher } from '../api/fetcher';
import { Authentication } from '../utils/auth.util';
import { useChatClient } from '../hooks/useChatClient';
import { useAppContext } from '../context/AppContext';

type LoginScreenProps = {
  navigation: UserSelectorScreenNavigationProp;
};

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const { loginUser } = useAppContext();

  const { bottom } = useSafeAreaInsets();
  const {
    theme: {
      colors: { accent_blue, button_background, button_text, white_snow },
    },
  } = useTheme();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const isValidInput = () => {
    let isValid = true;
    if (!email) {
      setEmailError(true);
      isValid = false;
    }

    if (!password) {
      setPasswordError(true);
      isValid = false;
    }

    return isValid;
  };

  const handleAuthenticationComplete = async () => {
    try {
      const {
        data: { name, vendor_id },
      } = await fetcher.legacyApi.get('/users/user');
      const { data: vendorLogo } = await fetcher.legacyApi.get(`vendors/${vendor_id}/logo`);
      const { data: streamChatToken } = await fetcher.legacyApi.get('/chat/token');

      loginUser({
        apiKey: 'vuw97daxjzux',
        userId: streamChatToken.id,
        userName: name,
        userToken: streamChatToken.token,
        userImage: vendorLogo.url,
      });
    } catch (e: any) {
      Alert.alert('Failed: get user auth', e.message);
    }
  };

  const getTwoFactor = async () => {
    try {
      const { data: challenge, headers } = await fetcher.legacyApi.get('/users/two-factor-auth');

      console.log('headers', headers);
      return challenge;
    } catch (e: any) {
      Alert.alert('Failed: get two factor auth', e.message);
    }
  };

  const clearSessions = async () => {
    try {
      await fetcher.legacyApi.post<void>('/users/clear-sessions');
    } catch (e: any) {
      Alert.alert('Failed: clear sessions', e.message);
    }
  };

  const handleLogin = async () => {
    try {
      await Authentication.login({ email, password });
      // const hasAccount = await checkHasAccount();

      // if (!hasAccount) {
      //   return;
      // }

      await clearSessions();

      const { challenge } = await getTwoFactor();
      if (challenge) {
        navigation.navigate('OtpScreen', { email, onSuccess: handleAuthenticationComplete });
      } else {
        await handleAuthenticationComplete();
      }
      // Success! The auth state change will be handled by your app's main auth listener
    } catch (error: any) {
      // Handle specific error cases
      switch (error.code) {
        case 'auth/email-already-in-use':
          Alert.alert('Error', 'That email address is already in use.');
          break;
        case 'auth/invalid-email':
          Alert.alert('Error', 'Please enter a valid email address.');
          break;
        case 'auth/wrong-password':
          Alert.alert('Error', 'Incorrect password.');
          break;
        case 'auth/user-not-found':
          Alert.alert('Error', 'No account found with this email.');
          break;
        default:
          Alert.alert('Error', 'Failed to sign in. Please try again.');
          console.error(error);
      }
    }
  };

  return (
    <KeyboardCompatibleView keyboardVerticalOffset={0}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: white_snow,
            paddingBottom: bottom,
          },
        ]}
      >
        <View style={styles.innerContainer}>
          <VendorPmLogo height={64} width={64} />
          <View style={styles.wrapper}>
            <Text style={styles.headerText}>Sign in to VendorPM</Text>
            <View style={styles.buttonContainer}>
              <GoogleSignIn />
              <MicrosoftSignIn />
              <CustomDivider />
            </View>
            <View style={styles.formContainer}>
              <LabeledTextInput
                error={emailError}
                label='Email Address*'
                onChangeText={(text) => {
                  setEmail(text);
                }}
                value={email}
                keyboardType='email-address'
              />
              <View style={styles.passwordContainer}>
                <LabeledTextInput
                  error={passwordError}
                  label='Password*'
                  onChangeText={(text) => {
                    setPassword(text);
                  }}
                  secureTextEntry={!isPasswordVisible}
                  value={password}
                  keyboardType='visible-password'
                />
                <TouchableOpacity onPress={togglePasswordVisibility} style={styles.visibleIcon}>
                  {isPasswordVisible ? (
                    <Eye height={16} width={16} color={accent_blue} />
                  ) : (
                    <EyeOff height={16} width={16} color={accent_blue} />
                  )}
                </TouchableOpacity>
              </View>
              <View style={styles.forgotPasswordContainer}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('ForgotPasswordScreen')}
                  style={styles.linkButton}
                >
                  <Text style={styles.linkText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={async () => {
                  if (!isValidInput()) {
                    return;
                  }

                  try {
                    await handleLogin();
                  } catch (e) {
                    Alert.alert(
                      'Login resulted in error. Please make sure you have entered valid credentials',
                    );
                  }
                }}
                style={[
                  styles.bottomInnerContainer,
                  {
                    backgroundColor: button_background,
                  },
                ]}
              >
                <Text
                  style={{
                    color: button_text,
                  }}
                >
                  Sign in
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </KeyboardCompatibleView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'center',
  },
  innerContainer: {
    height: '100%',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
    gap: 24,
  },
  wrapper: {
    alignItems: 'center',
    width: '100%',
    gap: 16,
  },
  headerContainer: {
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: '500',
  },
  buttonContainer: {
    width: '100%',
  },
  formContainer: {
    gap: 24,
    width: '100%',
  },
  bottomInnerContainer: {
    alignItems: 'center',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    fontWeight: '500',
    width: '100%',
  },
  passwordContainer: {
    position: 'relative',
  },
  visibleIcon: {
    position: 'absolute',
    top: '40%',
    right: 10,
  },
  forgotPasswordContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    marginLeft: 8,
  },
  linkButton: {
    padding: 4,
  },
  linkText: {
    color: '#0066CC', // or your theme's link color
  },
});
