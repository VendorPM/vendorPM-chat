import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'react-native-feather';
import type { RouteProp } from '@react-navigation/native';
import { OtpInput } from 'react-native-otp-entry';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { fetcher } from '../api/fetcher';
import { UserSelectorParamList } from '../types';

type OTPScreenProps = {
  route: RouteProp<UserSelectorParamList, 'OtpScreen'>;
};

export const OTPScreen: React.FC<OTPScreenProps> = ({
  route: {
    params: { email, onSuccess },
  },
}) => {
  const [otp, setOtp] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [customError, setCustomError] = useState<null | string>(null);

  const handleContinue = async () => {
    setIsLoading(true);

    try {
      await fetcher.legacyApi.post<void>('/users/verify-otp', {
        otp: otp,
        purpose: 'login',
      });
      onSuccess?.();
    } catch (e: any) {
      setCustomError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    // Handle resend logic here
    try {
      await fetcher.legacyApi.post<void>('/users/send-otp', {
        email,
        purpose: 'login',
      });
      setOtp('');
      setCustomError(null);
      Alert.alert('New code sent to email');
    } catch (e: any) {
      setCustomError(e.message);
    }
  };

  const getErrorText = () => {
    switch (customError) {
      case 'ERROR.EXPIRED_CODE':
        return 'This code has expired.';
      case 'ERROR.INTERNAL_SERVER_ERROR':
        return 'There was an error submitting your information. Please try again later';
      case 'ERROR.INVALID_CODE':
        return 'Incorrect code, please try again.';
      case 'ERROR.INVALID_SESSION':
        return 'Invalid session.';
      case 'ERROR.NEXT_CODE_REQUEST_PREVENTED_UNTIL':
        return 'Please wait 1 minute before sending another code.';
      case 'ERROR.SENDING_OTP':
        return 'There was an error submitting your information. Please resend code or try again later.';
      case 'ERROR.TOO_MANY_REQUESTS':
        return 'Too many requests, please wait before trying again.';
      default:
        return 'Failed to sign in. Please try again.';
    }
  };

  useEffect(() => {
    const sendInitialOtp = async () => {
      try {
        await fetcher.legacyApi.post<void>('/users/send-otp', {
          email,
          purpose: 'login',
        });
      } catch (e: any) {
        setCustomError(e.message);
      }
    };
    sendInitialOtp();
  }, [email]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Text style={styles.header}>Enter Code</Text>
      <Text style={styles.description}>
        Please enter the one-time verification code sent to
        <Text style={styles.email}> {email} </Text>
        within 15 min.
      </Text>

      <View style={styles.otpContainer}>
        <OtpInput focusColor='#007AFF' numberOfDigits={6} onTextChange={(text) => setOtp(text)} />
      </View>

      <TouchableOpacity
        style={[styles.continueButton, otp.length < 6 && styles.disabledButton]}
        onPress={handleContinue}
        disabled={otp.length < 6}
      >
        <Text style={styles.buttonText}>
          {isLoading ? <ActivityIndicator size='small' color='white' /> : 'Continue'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.resendButton} onPress={handleResend}>
        <Text style={styles.resendText}>Resend Code</Text>
      </TouchableOpacity>
      {customError !== null && (
        <View style={styles.errorContainer}>
          <AlertCircle height={24} width={24} color='#ce2c2c' style={styles.errorIcon} />
          <Text style={styles.errorMessage}>{getErrorText()}</Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 60,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    color: '#3f444a',
    marginBottom: 32,
    lineHeight: 20,
  },
  email: {
    color: '#000',
    fontWeight: '500',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 32,
    gap: 16,
  },
  continueButton: {
    backgroundColor: '#007AFF',
    width: '100%',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resendButton: {
    marginTop: 16,
    padding: 8,
  },
  resendText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fdf7f7', // Light red background
    borderColor: '#f8d3d3',
    borderLeftWidth: 4,
    borderLeftColor: '#ce2c2c', // Dark red border
    padding: 10,
    borderRadius: 4,
  },
  errorIcon: {
    marginRight: 10,
  },
  errorMessage: {
    flex: 1,
    fontSize: 14,
  },
});

export default OTPScreen;
