import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Eye, EyeOff } from 'react-native-feather';
import { useTheme } from 'stream-chat-react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import { LabeledTextInput } from './AdvancedUserSelectorScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { VendorPmLogo } from '../images/VendorPmLogo';
import { GoogleSignIn } from '../components/Login/GoogleSignIn';
import { MicrosoftSignIn } from '../components/Login/MicrosoftSignIn';
import CustomDivider from '../components/CustomDivider';
import { fetcher } from '../api/fetcher';
import { Authentication } from '../utils/auth.util';
import { useAppContext } from '../context/AppContext';
import { getS3Link } from '../utils/s3.util';
import { UserSelectorParamList } from '../types';
import { StackNavigationProp } from '@react-navigation/stack';

export type UserSelectorScreenNavigationProp = StackNavigationProp<UserSelectorParamList, 'Login'>;

type LoginScreenProps = {
  navigation: UserSelectorScreenNavigationProp;
};

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    try {
      const {
        data: { name, profile_pic },
      } = await fetcher.legacyApi.get('/users/user');

      const profilePicUrl = profile_pic ? getS3Link(profile_pic) : undefined;
      const { data: streamChatToken } = await fetcher.legacyApi.get('/chat/token');

      loginUser({
        apiKey: 'vuw97daxjzux',
        userId: streamChatToken.id,
        userName: name,
        userToken: streamChatToken.token,
        userImage: profilePicUrl,
      });
    } catch (e: any) {
      Alert.alert('Failed: get user auth', e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getTwoFactor = async () => {
    try {
      const { data: challenge } = await fetcher.legacyApi.get('/users/two-factor-auth');
      return challenge;
    } catch (e: any) {
      Alert.alert('Failed: get two factor auth', e.message);
    }
  };

  const checkHasAccount = async () => {
    const userExists = await fetcher.legacyApi.get('/users/has-account');

    if (!userExists) {
      await Authentication.unauthenticate();
      return Alert.alert('Error', 'Email not found');
    }

    return userExists;
  };

  const clearSessions = async () => {
    try {
      await fetcher.legacyApi.post<void>('/users/clear-sessions');
    } catch (e: any) {
      Alert.alert('Failed: clear sessions', e.message);
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await Authentication.login({ email, password });
      const hasAccount = await checkHasAccount();

      if (!hasAccount) {
        setIsLoading(false);
        return;
      }

      await clearSessions();

      const { challenge } = await getTwoFactor();
      if (challenge) {
        navigation.navigate('OtpScreen', { email, onSuccess: handleAuthenticationComplete });
      } else {
        await handleAuthenticationComplete();
      }
    } catch (err: any) {
      switch (err.code) {
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
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '525818996174-6g0os9h9d51b0fjgqdomaf658285b329.apps.googleusercontent.com',
    });
  }, []);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
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
              <GoogleSignIn onClick={handleAuthenticationComplete} />
              <MicrosoftSignIn onClick={handleAuthenticationComplete} />
              <CustomDivider />
            </View>
            <View style={styles.formContainer}>
              <LabeledTextInput
                error={emailError}
                label='Email Address*'
                onChangeText={(text) => {
                  setEmailError(false);
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
                    setPasswordError(false);
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
                disabled={isLoading}
              >
                <Text
                  style={{
                    color: button_text,
                  }}
                >
                  {isLoading ? <ActivityIndicator size='small' color={button_text} /> : 'Sign in'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignSelf: 'center',
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
