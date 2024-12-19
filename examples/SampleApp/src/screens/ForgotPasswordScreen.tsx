import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { UserSelectorScreenNavigationProp } from './UserSelectorScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardCompatibleView, useTheme } from 'stream-chat-react-native';

type ForgotPasswordScreenProps = {
  navigation: UserSelectorScreenNavigationProp;
};

const ForgotPasswordScreen = ({ navigation }: ForgotPasswordScreenProps) => {
  const [email, setEmail] = useState('');

  const { bottom } = useSafeAreaInsets();
  const {
    theme: {
      colors: { white_snow },
    },
  } = useTheme();

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
                onChangeText={setEmail}
                placeholder='info@vendorpm.com'
                keyboardType='email-address'
                autoCapitalize='none'
              />
            </View>

            <TouchableOpacity
              style={styles.resetButton}
              onPress={() => {
                /* Handle reset */
              }}
            >
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
          </View>
          <View>
            <Text style={styles.footerText}>Did you remember your password? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.linkText}>Try logging in</Text>
            </TouchableOpacity>
          </View>
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
});

export default ForgotPasswordScreen;
