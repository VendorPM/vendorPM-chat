import { useEffect, useRef, useState } from 'react';
import { StreamChat } from 'stream-chat';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import { QuickSqliteClient } from 'stream-chat-react-native';
import AsyncStore from '../utils/AsyncStore';

import type { LoginConfig, StreamChatGenerics } from '../types';
import { Authentication } from '../utils/auth.util';
import { PermissionsAndroid, Platform } from 'react-native';

const checkAndroidPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    } catch (error) {}
  }
};

// Request Push Notification permission from device.
const requestNotificationPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const isEnabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  console.log('Permission Status', { authStatus, isEnabled });
};

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  const messageId = remoteMessage.data?.id as string;
  if (!messageId) {
    return;
  }
  const config = await AsyncStore.getItem<LoginConfig | null>('@vendorPM-login-config', null);
  if (!config) {
    return;
  }

  const client = StreamChat.getInstance(config.apiKey);

  const user = {
    id: config.userId,
    image: config.userImage,
    name: config.userName,
  };

  await client._setToken(user, config.userToken);
  const message = await client.getMessage(messageId);

  // create the android channel to send the notification to
  const channelId = await notifee.createChannel({
    id: 'background',
    name: 'Background Messages',
  });

  if (message.message.user?.name && message.message.text) {
    const { stream, ...rest } = remoteMessage.data ?? {};
    const data = {
      ...rest,
      ...((stream as unknown as Record<string, string> | undefined) ?? {}), // extract and merge stream object if present
    };
    await notifee.displayNotification({
      android: {
        channelId,
        pressAction: {
          id: 'default',
        },
      },
      body: message.message.text,
      data,
      title: 'New message from ' + message.message.user.name,
    });
    await notifee.incrementBadgeCount();
  }
});

export const useChatClient = () => {
  const [chatClient, setChatClient] = useState<StreamChat<StreamChatGenerics> | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [unreadCount, setUnreadCount] = useState<number>();

  const unsubscribePushListenersRef = useRef<() => void>();

  /**
   * @param config the user login config
   * @returns function to unsubscribe from listeners
   */
  const loginUser = async (config: LoginConfig) => {
    // unsubscribe from previous push listeners
    unsubscribePushListenersRef.current?.();
    const client = StreamChat.getInstance<StreamChatGenerics>(config.apiKey, {
      timeout: 6000,
    });
    setChatClient(client);

    const user = {
      id: config.userId,
      image: config.userImage,
      name: config.userName,
    };
    const connectedUser = await client.connectUser(user, config.userToken);
    const initialUnreadCount = connectedUser?.me?.total_unread_count;
    setUnreadCount(initialUnreadCount);
    await AsyncStore.setItem('@vendorPM-login-config', config);

    const permissionAuthStatus = await messaging().hasPermission();
    const isEnabled =
      permissionAuthStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      permissionAuthStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (isEnabled) {
      // Register FCM token with stream chat server.
      const token = await messaging().getToken();
      await client.addDevice(token, 'firebase', config.userId, 'chatNotification');

      // Listen to new FCM tokens and register them with stream chat server.
      const unsubscribeTokenRefresh = messaging().onTokenRefresh(async (newToken) => {
        await client.addDevice(newToken, 'firebase', config.userId, 'chatNotification');
      });
      // show notifications when on foreground
      const unsubscribeForegroundMessageReceive = messaging().onMessage(async (remoteMessage) => {
        const messageId = remoteMessage.data?.id;
        if (!messageId) {
          return;
        }
        const message = await client.getMessage(messageId);
        if (message.message.user?.name && message.message.text) {
          // create the android channel to send the notification to
          const channelId = await notifee.createChannel({
            id: 'foreground',
            name: 'In-App Notifications',
          });
          // display the notification on foreground
          const { stream, ...rest } = remoteMessage.data ?? {};
          const data = {
            ...rest,
            ...((stream as unknown as Record<string, string> | undefined) ?? {}), // extract and merge stream object if present
          };
          await notifee.displayNotification({
            android: {
              channelId,
              pressAction: {
                id: 'default',
              },
            },
            ios: {
              // Add iOS configuration
              sound: 'default', // Optional: specify a sound for the notification
              // Additional iOS-specific options can be added here
            },
            body: message.message.text,
            data,
            title: 'New message from ' + message.message.user.name,
          });
        }
      });

      unsubscribePushListenersRef.current = () => {
        unsubscribeTokenRefresh();
        unsubscribeForegroundMessageReceive();
      };
    }
    setChatClient(client);
  };

  const switchUser = async () => {
    setIsConnecting(true);

    const config = await AsyncStore.getItem<LoginConfig | null>('@vendorPM-login-config', null);

    if (config) {
      await loginUser(config);
    }

    setIsConnecting(false);
  };

  const logout = async () => {
    QuickSqliteClient.resetDB();
    setChatClient(null);
    chatClient?.disconnectUser();
    await Authentication.logout();
    await notifee.setBadgeCount(0);
  };

  useEffect(() => {
    const run = async () => {
      await checkAndroidPermission();
      await requestNotificationPermission();
      await switchUser();
    };
    run();
    return unsubscribePushListenersRef.current;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Listen to changes in unread counts and update the badge count
   */
  useEffect(() => {
    const listener = chatClient?.on(async (e) => {
      if (e.total_unread_count !== undefined) {
        await notifee.setBadgeCount(e.total_unread_count);
        setUnreadCount(e.total_unread_count);
      } else {
        const countUnread = Object.values(chatClient.activeChannels).reduce(
          (count, channel) => count + channel.countUnread(),
          0,
        );
        await notifee.setBadgeCount(countUnread);
        setUnreadCount(countUnread);
      }
    });

    return () => {
      if (listener) {
        listener.unsubscribe();
      }
    };
  }, [chatClient]);

  return {
    chatClient,
    isConnecting,
    loginUser,
    logout,
    unreadCount,
  };
};
