import React, { useEffect } from 'react';
import { DevSettings, LogBox, Platform, useColorScheme, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-devsettings/withAsyncStorage';

import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Chat,
  OverlayProvider,
  QuickSqliteClient,
  ThemeProvider,
  useOverlayContext,
} from 'stream-chat-react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';
import { AppContext } from './src/context/AppContext';
import { AppOverlayProvider } from './src/context/AppOverlayProvider';
import { UserSearchProvider } from './src/context/UserSearchContext';
import { useChatClient } from './src/hooks/useChatClient';
import { useStreamChatTheme } from './src/hooks/useStreamChatTheme';
import { ChannelFilesScreen } from './src/screens/ChannelFilesScreen';
import { ChannelImagesScreen } from './src/screens/ChannelImagesScreen';
import { ChannelScreen } from './src/screens/ChannelScreen';
import { ChannelPinnedMessagesScreen } from './src/screens/ChannelPinnedMessagesScreen';
import { ChatScreen } from './src/screens/ChatScreen';
import { GroupChannelDetailsScreen } from './src/screens/GroupChannelDetailsScreen';
import { LoadingScreen } from './src/screens/LoadingScreen';
import { MenuDrawer } from './src/screens/MenuDrawer';
import { NewDirectMessagingScreen } from './src/screens/NewDirectMessagingScreen';
import { NewGroupChannelAddMemberScreen } from './src/screens/NewGroupChannelAddMemberScreen';
import { NewGroupChannelAssignNameScreen } from './src/screens/NewGroupChannelAssignNameScreen';
import { OneOnOneChannelDetailScreen } from './src/screens/OneOnOneChannelDetailScreen';
import { SharedGroupsScreen } from './src/screens/SharedGroupsScreen';
import { ThreadScreen } from './src/screens/ThreadScreen';

import type { StreamChat } from 'stream-chat';
import { firebase } from './src/utils/firebase.util';

if (__DEV__) {
  DevSettings.addMenuItem('Reset local DB (offline storage)', () => {
    QuickSqliteClient.resetDB();
    console.info('Local DB reset');
  });
}

import type {
  StackNavigatorParamList,
  StreamChatGenerics,
  UserSelectorParamList,
} from './src/types';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { navigateToChannel, RootNavigationRef } from './src/utils/RootNavigation';
import FastImage from 'react-native-fast-image';
import { LoginScreen } from './src/screens/LoginScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import OtpScreen from './src/screens/OtpScreen';

LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']);
console.assert = () => null;

// when a channel id is set here, the intial route is the channel screen
const initialChannelIdGlobalRef = { current: '' };
const initialChannelTypeGlobalRef = { current: '' };

notifee.onBackgroundEvent(async ({ detail, type }) => {
  // user press on notification detected while app was on background on Android
  if (type === EventType.PRESS) {
    const channelId = detail.notification?.data?.channel_id as string;
    const channelType = detail.notification?.data?.channel_type as string;
    if (channelId) {
      await notifee.decrementBadgeCount();
      navigateToChannel(channelId, channelType);
    }
    await Promise.resolve();
  }
});

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator<StackNavigatorParamList>();
const UserSelectorStack = createStackNavigator<UserSelectorParamList>();
const App = () => {
  const { chatClient, isConnecting, loginUser, logout, switchUser, unreadCount } = useChatClient();
  const colorScheme = useColorScheme();
  const streamChatTheme = useStreamChatTheme();

  useEffect(() => {
    const unsubscribeOnNotificationOpen = messaging().onNotificationOpenedApp(
      async (remoteMessage) => {
        // Notification caused app to open from background state on iOS
        const channelId = remoteMessage.data?.channel_id as string;
        const channelType = remoteMessage.data?.channel_type as string;
        if (channelId) {
          await notifee.decrementBadgeCount();
          navigateToChannel(channelId, channelType);
        }
      },
    );
    // handle notification clicks on foreground
    const unsubscribeForegroundEvent = notifee.onForegroundEvent(async ({ detail, type }) => {
      if (type === EventType.PRESS) {
        // user has pressed the foreground notification
        const channelId = detail.notification?.data?.channel_id as string;
        const channelType = detail.notification?.data?.channel_type as string;
        if (channelId) {
          await notifee.decrementBadgeCount();
          navigateToChannel(channelId, channelType);
        }
      }
    });
    notifee.getInitialNotification().then((initialNotification) => {
      if (initialNotification) {
        // Notification caused app to open from quit state on Android
        const channelId = initialNotification.notification.data?.channel_id as string;
        const channelType = initialNotification.notification.data?.channel_type as string;
        if (channelId) {
          initialChannelIdGlobalRef.current = channelId;
          initialChannelTypeGlobalRef.current = channelType;
        }
      }
    });
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          // Notification caused app to open from quit state on iOS
          const channelId = remoteMessage.data?.channel_id as string;
          const channelType = remoteMessage.data?.channel_type as string;
          if (channelId) {
            // this will make the app to start with the channel screen with this channel id
            initialChannelIdGlobalRef.current = channelId;
            initialChannelTypeGlobalRef.current = channelType;
          }
        }
      });
    return () => {
      unsubscribeOnNotificationOpen();
      unsubscribeForegroundEvent();
    };
  }, []);

  useEffect(() => {
    try {
      firebase.initialize();
      notifee.setBadgeCount(0);
    } catch (error) {
      console.error('Failed to initialize Firebase:', error);
    }
  }, []);

  return (
    <SafeAreaProvider
      style={{
        backgroundColor: streamChatTheme.colors?.white_snow || '#FCFCFC',
      }}
    >
      <ThemeProvider style={streamChatTheme}>
        <NavigationContainer
          ref={RootNavigationRef}
          theme={{
            colors: {
              ...(colorScheme === 'dark' ? DarkTheme : DefaultTheme).colors,
              background: streamChatTheme.colors?.white_snow || '#FCFCFC',
            },
            dark: colorScheme === 'dark',
          }}
        >
          <AppContext.Provider value={{ chatClient, loginUser, logout, switchUser, unreadCount }}>
            {isConnecting && !chatClient ? (
              <LoadingScreen />
            ) : chatClient ? (
              <DrawerNavigatorWrapper chatClient={chatClient} />
            ) : (
              <UserSelector />
            )}
          </AppContext.Provider>
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

const DrawerNavigator: React.FC = () => (
  <Drawer.Navigator
    drawerContent={MenuDrawer}
    screenOptions={{
      drawerStyle: {
        width: 300,
      },
    }}
  >
    <Drawer.Screen component={HomeScreen} name='HomeScreen' options={{ headerShown: false }} />
  </Drawer.Navigator>
);

const DrawerNavigatorWrapper: React.FC<{
  chatClient: StreamChat<StreamChatGenerics>;
}> = ({ chatClient }) => {
  const { bottom } = useSafeAreaInsets();
  const streamChatTheme = useStreamChatTheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <OverlayProvider<StreamChatGenerics> bottomInset={bottom} value={{ style: streamChatTheme }}>
        <Chat<StreamChatGenerics>
          client={chatClient}
          enableOfflineSupport
          // @ts-expect-error
          ImageComponent={FastImage}
        >
          <AppOverlayProvider>
            <UserSearchProvider>
              <DrawerNavigator />
            </UserSearchProvider>
          </AppOverlayProvider>
        </Chat>
      </OverlayProvider>
    </GestureHandlerRootView>
  );
};

const UserSelector = () => {
  return (
    <UserSelectorStack.Navigator initialRouteName='Login'>
      <UserSelectorStack.Screen
        component={LoginScreen}
        name='Login'
        options={{
          gestureEnabled: false,
          headerShown: false,
        }}
      />
      <UserSelectorStack.Screen
        component={OtpScreen}
        initialParams={{ email: '' }}
        name='OtpScreen'
        options={{
          gestureEnabled: true,
          headerBackground: () => <View style={{ backgroundColor: 'white' }} />,
          headerTitle: 'VendorPM',
          headerTitleStyle: { color: 'black' },
        }}
      />
      <UserSelectorStack.Screen
        component={ForgotPasswordScreen}
        name='ForgotPasswordScreen'
        options={{
          gestureEnabled: true,
          headerBackground: () => <View style={{ backgroundColor: 'white' }} />,
          headerTitle: 'VendorPM',
          headerTitleStyle: { color: 'black' },
        }}
      />
    </UserSelectorStack.Navigator>
  );
};

// TODO: Split the stack into multiple stacks - ChannelStack, CreateChannelStack etc.
const HomeScreen = () => {
  const { overlay } = useOverlayContext();

  return (
    <Stack.Navigator
      initialRouteName={initialChannelIdGlobalRef.current ? 'ChannelScreen' : 'MessagingScreen'}
    >
      <Stack.Screen
        component={ChatScreen}
        name='MessagingScreen'
        options={{ headerShown: false }}
      />
      <Stack.Screen
        component={ChannelScreen}
        initialParams={
          initialChannelIdGlobalRef.current
            ? {
                channelId: initialChannelIdGlobalRef.current,
                channelType: initialChannelTypeGlobalRef.current,
              }
            : undefined
        }
        name='ChannelScreen'
        options={{
          gestureEnabled: Platform.OS === 'ios' && overlay === 'none',
          headerShown: false,
        }}
      />
      <Stack.Screen
        component={NewDirectMessagingScreen}
        name='NewDirectMessagingScreen'
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        component={NewGroupChannelAddMemberScreen}
        name='NewGroupChannelAddMemberScreen'
        options={{ headerShown: false }}
      />
      <Stack.Screen
        component={NewGroupChannelAssignNameScreen}
        name='NewGroupChannelAssignNameScreen'
        options={{ headerShown: false }}
      />
      <Stack.Screen
        component={OneOnOneChannelDetailScreen}
        name='OneOnOneChannelDetailScreen'
        options={{ headerShown: false }}
      />
      <Stack.Screen
        component={GroupChannelDetailsScreen}
        name='GroupChannelDetailsScreen'
        options={{ headerShown: false }}
      />
      <Stack.Screen
        component={ChannelImagesScreen}
        name='ChannelImagesScreen'
        options={{ headerShown: false }}
      />
      <Stack.Screen
        component={ChannelFilesScreen}
        name='ChannelFilesScreen'
        options={{ headerShown: false }}
      />
      <Stack.Screen
        component={ChannelPinnedMessagesScreen}
        name='ChannelPinnedMessagesScreen'
        options={{ headerShown: false }}
      />
      <Stack.Screen
        component={SharedGroupsScreen}
        name='SharedGroupsScreen'
        options={{ headerShown: false }}
      />
      <Stack.Screen
        component={ThreadScreen}
        name='ThreadScreen'
        options={{
          gestureEnabled: Platform.OS === 'ios' && overlay === 'none',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default App;
