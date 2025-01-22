import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DateHeaderProps, useTheme } from 'stream-chat-react-native';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 16,
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 8,
    paddingHorizontal: 8,
    backgroundColor: 'red',
  },
  text: {
    fontSize: 12,
    padding: 4,
    textAlign: 'center',
    textAlignVertical: 'center',
    // marginVertical: 16,
  },
});

export const CustomDateHeader = ({ dateString }: DateHeaderProps) => {
  const {
    theme: {
      colors: { overlay, white },
    },
  } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: overlay }]}>
      <Text style={[styles.text, { color: white }]}>{dateString}</Text>
    </View>
  );
};
