import React, { useState } from 'react';
import { CheckCircle } from 'react-native-feather';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { UserSelectorScreenNavigationProp } from './UserSelectorScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardCompatibleView, useTheme } from 'stream-chat-react-native';
import { fetcher } from '../api/fetcher';

type ForgotPasswordScreenProps = {
  navigation: UserSelectorScreenNavigationProp;
};

const ForgotPasswordScreen = ({ navigation }: ForgotPasswordScreenProps) => {
  const [email, setEmail] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);

  const { bottom } = useSafeAreaInsets();
  const {
    theme: {
      colors: { white_snow },
    },
  } = useTheme();

  const handlePasswordReset = async () => {
    setIsLoading(true);
    try {
      await fetcher.legacyApi.post('/users/password-reset', { email });
      setSuccessAlert(true);
    } catch (e: any) {
      Alert.alert('Error', 'Failed to send password reset email. Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = () => {
    if (email) {
      handlePasswordReset();
    } else {
      Alert.alert('Error', 'Please enter a valid email address.');
    }
  };

  const handleEmailChange = (newEmail: string) => {
    setEmail(newEmail);
    if (successAlert) {
      setSuccessAlert(false);
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
          <View style={styles.titleWrapper}>
            <Text style={styles.title}>Forgot Password</Text>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              Email Address <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={handleEmailChange}
                placeholder='info@vendorpm.com'
                keyboardType='email-address'
                autoCapitalize='none'
              />
            </View>

            <TouchableOpacity style={styles.resetButton} onPress={onSubmit}>
              <Text style={styles.resetButtonText}>
                {isLoading ? <ActivityIndicator size='small' color='white' /> : 'Reset'}
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            <Text style={styles.footerText}>Did you remember your password? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.linkText}>Try logging in</Text>
            </TouchableOpacity>
          </View>
          {successAlert && (
            <View style={styles.alertContainer}>
              <View style={styles.alertIconContainer}>
                <CheckCircle height={16} width={16} color={'#2E7D32'} />
              </View>
              <View style={styles.alertDescriptionContainer}>
                <Text style={styles.alertTitle}>Password reset request received</Text>
                <Text style={styles.alertDescription}>
                  If we find <Text style={styles.alertEmail}>{email}</Text> in our system, you
                  should receive an email with a link to reset your password.
                </Text>
                <Text style={styles.alertDescription}>
                  If you don’t see the email in your inbox, check your spam folder, contact us or
                  try a different email address.
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </KeyboardCompatibleView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    height: '100%',
  },
  innerContainer: {
    justifyContent: 'center',
    padding: 24,
    paddingVertical: 40,
    gap: 24,
  },
  titleWrapper: {
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  required: {
    color: 'red',
  },
  inputWrapper: {
    borderWidth: 1,
    gap: 16,
    borderColor: '#E5E7EB',
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  input: {
    padding: 12,
    fontSize: 16,
  },
  resetButton: {
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 8,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  footerText: {
    fontSize: 16,
    color: '#4B5563',
  },
  linkText: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '500',
  },

  alertContainer: {
    flexDirection: 'row',
    gap: 16,
    backgroundColor: '#cde5d3',
    padding: 24,
    borderRadius: 8,
    elevation: 2,
  },
  alertIconContainer: {
    alignItems: 'center',
  },
  alertDescriptionContainer: {
    flexShrink: 1,
  },
  alertTitle: {
    fontSize: 12,
    fontWeight: '400',
    color: '#0a521e',
    marginBottom: 8,
  },
  alertDescription: {
    fontSize: 14,
    color: '#0a521e',
    marginBottom: 4,
    lineHeight: 20,
  },
  alertEmail: {
    fontWeight: '600',
  },
});

export default ForgotPasswordScreen;
