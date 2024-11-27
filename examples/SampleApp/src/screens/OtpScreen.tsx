import React, { useState, useRef, useEffect } from 'react';
import type { RouteProp } from '@react-navigation/native';

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
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
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<TextInput[]>([]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleContinue = async () => {
    const otpString = otp.join('');
    // Handle OTP verification here
    const { data: otpSuccess } = await fetcher.legacyApi.post<void>('/users/verify-otp', {
      otp: otpString,
      purpose: 'login',
      onSuccess: () => onSuccess?.(),
    });

    console.log('===>', otpSuccess);

    const { data: contacts } = await fetcher.legacyApi.get('/vendors/17796/contacts');

    console.log('===>', contacts);
    console.log('Verifying OTP:', otpString);
  };

  const handleResend = () => {
    // Handle resend logic here
    console.log('Resending OTP');
  };

  useEffect(() => {
    const sendInitialOtp = async () => {
      try {
        await fetcher.legacyApi.post<void>('/users/send-otp', {
          email,
          purpose: 'login',
        });
      } catch (e: any) {
        Alert.alert(e.message);
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
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref as TextInput)}
            style={styles.otpInput}
            maxLength={1}
            keyboardType='number-pad'
            value={digit}
            onChangeText={(value) => handleOtpChange(value, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
          />
        ))}
      </View>

      <TouchableOpacity
        style={[styles.continueButton, !otp.every(Boolean) && styles.disabledButton]}
        onPress={handleContinue}
        disabled={!otp.every(Boolean)}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.resendButton} onPress={handleResend}>
        <Text style={styles.resendText}>Resend Code</Text>
      </TouchableOpacity>
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
  otpInput: {
    flexGrow: 1,
    height: 45,
    width: 'auto',
    borderWidth: 1,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 20,
    borderColor: '#ccc',
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
});

export default OTPScreen;
