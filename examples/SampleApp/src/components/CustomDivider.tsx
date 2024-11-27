import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CustomDivider = () => {
  return (
    <View style={styles.container}>
      <View style={styles.divider} />
      <Text style={styles.text}>or</Text>
      <View style={styles.divider} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 8,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e5e5',
  },
  text: {
    backgroundColor: 'white',
    padding: 8,
    color: '#737373',
  },
});

export default CustomDivider;
