import React, { useEffect, useState } from 'react';
import Clipboard from '@react-native-clipboard/clipboard';
import type { Channel as StreamChatChannel } from 'stream-chat';
import { RouteProp, useNavigation } from '@react-navigation/native';
import {
  Channel,
  ChannelAvatar,
  MessageInput,
  MessageList,
  messageActions as defaultMessageActions,
  useAttachmentPickerContext,
  useChannelPreviewDisplayName,
  useChatContext,
  useTheme,
  useTypingString,
} from 'stream-chat-react-native';
import { Platform, StyleSheet, Text, View } from 'react-native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppContext } from '../context/AppContext';
import { ScreenHeader } from '../components/ScreenHeader';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useChannelMembersStatus } from '../hooks/useChannelMembersStatus';

import type { StackNavigatorParamList, StreamChatGenerics } from '../types';
import { NetworkDownIndicator } from '../components/NetworkDownIndicator';
import { CustomDateSeparator } from '../components/CustomDateSeparator';
import { CustomDateHeader } from '../components/CustomDateHeader';

const styles = StyleSheet.create({
  flex: { flex: 1 },
  headerSubtitle: {
    alignItems: 'center',
  },
  titleText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  addressText: {
    fontSize: 12,
  },
  statusText: {
    fontSize: 10,
    marginTop: 8,
  },
});

export type ChannelScreenNavigationProp = StackNavigationProp<
  StackNavigatorParamList,
  'ChannelScreen'
>;
export type ChannelScreenRouteProp = RouteProp<StackNavigatorParamList, 'ChannelScreen'>;
export type ChannelScreenProps = {
  navigation: ChannelScreenNavigationProp;
  route: ChannelScreenRouteProp;
};

export type ChannelHeaderProps = {
  channel: StreamChatChannel<StreamChatGenerics>;
};

const Title = ({ displayName }: { displayName: string }) => {
  return <Text style={styles.titleText}>{displayName}</Text>;
};

const Subtitle: React.FC<ChannelHeaderProps> = ({ channel }) => {
  const membersStatus = useChannelMembersStatus(channel);
  const { isOnline } = useChatContext();
  const typing = useTypingString();

  if (isOnline) {
    return (
      <View style={styles.headerSubtitle}>
        {/* TODO: Remove this hardcoded value once we have the api */}
        <Text style={styles.addressText}>12 Front St., Toronto, ON</Text>
        {<Text style={styles.statusText}>{typing ? typing : membersStatus}</Text>}
      </View>
    );
  } else {
    return <NetworkDownIndicator titleSize='large' />;
  }
};

const ChannelHeader: React.FC<ChannelHeaderProps> = ({ channel }) => {
  const { closePicker } = useAttachmentPickerContext();
  const displayName = useChannelPreviewDisplayName(channel, 30);
  const { chatClient } = useAppContext();
  const navigation = useNavigation<ChannelScreenNavigationProp>();

  if (!channel || !chatClient) {
    return null;
  }

  const isOneOnOneConversation =
    channel &&
    Object.values(channel.state.members).length === 2 &&
    channel.id?.indexOf('!members-') === 0;

  return (
    <ScreenHeader
      onBack={() => {
        if (!navigation.canGoBack()) {
          // if no previous screen was present in history, go to the list screen
          // this can happen when opened through push notification
          navigation.reset({ index: 0, routes: [{ name: 'MessagingScreen' }] });
        } else {
          navigation.goBack();
        }
      }}
      // eslint-disable-next-line react/no-unstable-nested-components
      RightContent={() => (
        <TouchableOpacity
          onPress={() => {
            closePicker();
            if (isOneOnOneConversation) {
              navigation.navigate('OneOnOneChannelDetailScreen', {
                channel,
              });
            } else {
              navigation.navigate('GroupChannelDetailsScreen', {
                channel,
              });
            }
          }}
        >
          <ChannelAvatar channel={channel} />
        </TouchableOpacity>
      )}
      showUnreadCountBadge
      Subtitle={() => Subtitle({ channel })}
      Title={() => Title({ displayName })}
      titleText=''
    />
  );
};

// Either provide channel or channelId.
export const ChannelScreen: React.FC<ChannelScreenProps> = ({
  route: {
    params: { channel: channelFromProp, channelId, messageId, channelType },
  },
}) => {
  const { chatClient } = useAppContext();
  const { bottom } = useSafeAreaInsets();
  const {
    theme: {
      colors: { white },
    },
  } = useTheme();

  const [channel, setChannel] = useState<StreamChatChannel<StreamChatGenerics> | undefined>(
    channelFromProp,
  );

  useEffect(() => {
    const initChannel = async () => {
      if (!chatClient || !channelId || !channelType) {
        return;
      }

      const newChannel = chatClient?.channel(channelType, channelId);
      if (!newChannel?.initialized) {
        await newChannel?.watch();
      }
      setChannel(newChannel);
    };

    initChannel();
  }, [channelId, chatClient, channelType]);

  if (!channel || !chatClient) {
    return null;
  }

  return (
    <View style={[styles.flex, { backgroundColor: white, paddingBottom: bottom }]}>
      <Channel
        audioRecordingEnabled={true}
        channel={channel}
        disableTypingIndicator
        enforceUniqueReaction
        initialScrollToFirstUnreadMessage
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -300}
        messageId={messageId}
        NetworkDownIndicator={() => null}
        hasCommands={false}
        messageActions={(param) => {
          const { message } = param;
          // Retrieve default actions
          const actions = defaultMessageActions(param);

          const copyMessageAction = {
            actionType: 'copyMessage',
            title: 'Copy Message',
            action: () => {
              Clipboard.setString(message.text ?? '');
            },
          };
          // Filter out the "Thread Reply" action
          const filteredActions = actions.filter((action) => action.actionType !== 'threadReply'); // 'reply' is the action id for thread reply
          actions.push(copyMessageAction);
          return filteredActions;
        }}
        DateHeader={CustomDateHeader}
        InlineDateSeparator={CustomDateSeparator}
      >
        <ChannelHeader channel={channel} />
        <MessageList<StreamChatGenerics> thread={null} />
        <MessageInput audioRecordingEnabled={false} />
      </Channel>
    </View>
  );
};
