import React, { useState } from 'react';
import { KeyboardTypeOptions, StyleSheet, Text, TextInput, View } from 'react-native';
import { useTheme } from 'stream-chat-react-native';

type LabeledTextInputProps = {
  onChangeText: (text: string) => void;
  value: string;
  error?: boolean;
  label?: string;
  secureTextEntry?: boolean;
  inputStyle?: any;
  keyboardType?: KeyboardTypeOptions;
  textContentType?: any;
};

export const LabeledTextInput: React.FC<LabeledTextInputProps> = ({
  error = false,
  label = '',
  onChangeText,
  value,
  secureTextEntry = false,
  inputStyle = {},
  keyboardType = 'default',
  textContentType = 'oneTimeCode',
}) => {
  const {
    theme: {
      colors: { accent_blue, accent_red, black, grey, white_smoke },
    },
  } = useTheme();
  const [borderColor, setBorderColor] = useState(white_smoke);

  const onFocus = () => {
    setBorderColor(accent_blue);
  };

  const onBlur = () => {
    setBorderColor(white_smoke);
  };

  const isEmpty = value === undefined;

  return (
    <View
      style={[
        styles.labelTextContainer,
        {
          backgroundColor: white_smoke,
          borderColor,
          borderWidth: 1,
          paddingVertical: !!value || !!error ? 16 : 8,
        },
      ]}
    >
      {!!value && (
        <Text
          style={[
            styles.labelText,
            {
              color: grey,
            },
          ]}
        >
          {label}
        </Text>
      )}
      {!!error && (
        <Text
          style={[
            styles.labelText,
            {
              color: accent_red,
            },
          ]}
        >
          Please enter {label}
        </Text>
      )}
      <TextInput
        onBlur={onBlur}
        onChangeText={onChangeText}
        onFocus={onFocus}
        placeholder={label}
        placeholderTextColor={grey}
        returnKeyType='next'
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        textContentType={textContentType}
        style={[
          styles.input,
          {
            color: black,
            fontWeight: isEmpty ? '500' : 'normal',
          },
          inputStyle,
        ]}
        value={value}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    fontSize: 14,
    includeFontPadding: false,
    padding: 0,
    paddingTop: 0,
    textAlignVertical: 'center',
  },
  labelText: {
    fontSize: 10,
    fontWeight: '700',
  },
  labelTextContainer: {
    borderRadius: 6,
    height: 48,
    justifyContent: 'center',
    marginTop: 8,
    paddingHorizontal: 16,
  },
});
