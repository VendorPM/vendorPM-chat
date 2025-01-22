import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { InlineDateSeparatorProps, useTheme } from 'stream-chat-react-native';
import { formatDate } from '../utils/formatDate.util';

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
  },
});

export const CustomDateSeparator = ({ date }: InlineDateSeparatorProps) => {
  const {
    theme: {
      colors: { overlay, white },
    },
  } = useTheme();

  const formattedDate = date ? formatDate(date) : '';

  return (
    <View style={[styles.container, { backgroundColor: overlay }]} testID='date-separator'>
      <Text style={[styles.text, { color: white }]}>{formattedDate}</Text>
    </View>
  );
};
