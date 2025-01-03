import React from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { useChatContext } from 'stream-chat-react-native';

import { ScreenHeader } from './ScreenHeader';

import { useAppContext } from '../context/AppContext';

import type { DrawerNavigationProp } from '@react-navigation/drawer';
import type { StackNavigationProp } from '@react-navigation/stack';

import type { DrawerNavigatorParamList, StackNavigatorParamList } from '../types';
import { NetworkDownIndicator } from './NetworkDownIndicator';

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 20,
    height: 40,
    width: 40,
  },
});

type ChatScreenHeaderNavigationProp = CompositeNavigationProp<
  DrawerNavigationProp<DrawerNavigatorParamList>,
  StackNavigationProp<StackNavigatorParamList>
>;

export const ChatScreenHeader: React.FC<{ title?: string }> = ({ title = 'Inbox' }) => {
  const navigation = useNavigation<ChatScreenHeaderNavigationProp>();
  const { chatClient } = useAppContext();
  const { isOnline } = useChatContext();

  return (
    <ScreenHeader
      // eslint-disable-next-line react/no-unstable-nested-components
      LeftContent={() => (
        <TouchableOpacity onPress={navigation.openDrawer}>
          <Image
            source={{
              uri: chatClient?.user?.image,
            }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      )}
      // eslint-disable-next-line react/no-unstable-nested-components
      Title={isOnline ? undefined : () => <NetworkDownIndicator titleSize='large' />}
      titleText={title}
    />
  );
};
