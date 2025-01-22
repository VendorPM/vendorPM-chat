import type { Immutable } from 'seamless-immutable';
import type { Channel, UserResponse } from 'stream-chat';
import type { Theme } from '@react-navigation/native';

export type LocalAttachmentType = {
  file_size?: number;
  mime_type?: string;
};
export type LocalChannelType = Record<string, unknown>;
export type LocalCommandType = string;
export type LocalEventType = Record<string, unknown>;
export type LocalMessageType = Record<string, unknown>;
export type LocalReactionType = Record<string, unknown>;
export type LocalUserType = {
  image?: string;
};
type LocalPollOptionType = Record<string, unknown>;
type LocalPollType = Record<string, unknown>;

export type StreamChatGenerics = {
  attachmentType: LocalAttachmentType;
  channelType: LocalChannelType;
  commandType: LocalCommandType;
  eventType: LocalEventType;
  messageType: LocalMessageType;
  pollOptionType: LocalPollOptionType;
  pollType: LocalPollType;
  reactionType: LocalReactionType;
  userType: LocalUserType;
};

export type DrawerNavigatorParamList = {
  HomeScreen: undefined;
  UserSelectorScreen: undefined;
};

export type StackNavigatorParamList = {
  ChannelFilesScreen: {
    channel: Channel<StreamChatGenerics>;
  };
  ChannelImagesScreen: {
    channel: Channel<StreamChatGenerics>;
  };
  ChannelListScreen: undefined;
  ChannelPinnedMessagesScreen: {
    channel: Channel<StreamChatGenerics>;
  };
  ChannelScreen: {
    channel?: Channel<StreamChatGenerics>;
    channelId?: string;
    messageId?: string;
    channelType?: string;
  };
  GroupChannelDetailsScreen: {
    channel: Channel<StreamChatGenerics>;
  };
  MessagingScreen: undefined;
  NewDirectMessagingScreen: undefined;
  NewGroupChannelAddMemberScreen: undefined;
  NewGroupChannelAssignNameScreen: undefined;
  OneOnOneChannelDetailScreen: {
    channel: Channel<StreamChatGenerics>;
  };
  SharedGroupsScreen: {
    user: Immutable<UserResponse<StreamChatGenerics>> | UserResponse<StreamChatGenerics>;
  };
};

export type UserSelectorParamList = {
  ForgotPasswordScreen: undefined;
  Login: undefined;
  OtpScreen: { email: string; onSuccess?: () => void };
};

export type AppTheme = Theme & {
  colors: {
    background: string;
    backgroundFadeGradient: string;
    backgroundNavigation: string;
    backgroundSecondary: string;
    borderLight: string;
    danger: string;
    dateStampBackground: string;
    footnote: string;
    greyContentBackground: string;
    iconButtonBackground: string;
    success: string;
    text: string;
    textInverted: string;
    textLight: string;
    textSecondary: string;
  };
};

export type LoginConfig = {
  apiKey: string;
  userId: string;
  userToken: string;
  userImage?: string;
  userName?: string;
};
