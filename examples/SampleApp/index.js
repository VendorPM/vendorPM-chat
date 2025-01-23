import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { StreamChat } from 'stream-chat';
import notifee, { AndroidImportance } from '@notifee/react-native';


import { enableScreens } from 'react-native-screens';

import App from './App';
import { name as appName } from './app.json';
import AsyncStore from './src/utils/AsyncStore';


messaging().setBackgroundMessageHandler(async (remoteMessage) => {

  const messageId = remoteMessage.data?.id ;
  if (!messageId) {
    return;
  }

  // Check if user is logged in
  const config = await AsyncStore.getItem('@vendorPM-login-config', null);
  if (!config) {
    console.log('User not logged in. Skipping background message handling.');
    return;
  }

  // Initialize Stream Chat client with user data
  const client = StreamChat.getInstance(config.apiKey);

  const user = {
    id: config.userId,
    image: config.userImage,
    name: config.userName,
  };

  await client._setToken(user, config.userToken);
  const message = await client.getMessage(messageId);

  // Create a notification channel
  const channelId = await notifee.createChannel({
    id: 'background',
    name: 'Background',
    importance: AndroidImportance.HIGH,
    bypassDnd: true,
    sound: 'default',
  });

  // Display the notification
  if (message.message.user?.name && message.message.text) {
    const { stream, ...rest } = remoteMessage.data ?? {};
    const data = {
      ...rest,
      ...(stream  ?? {}),
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

function HeadlessCheck({ isHeadless }) {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null;
  }

  // Render the app component on foreground launch
  return <App />;
}

enableScreens();
AppRegistry.registerComponent(appName, () => HeadlessCheck);
