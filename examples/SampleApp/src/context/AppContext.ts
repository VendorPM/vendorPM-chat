import React from 'react';

import type { StreamChat } from 'stream-chat';

import type { LoginConfig, StreamChatGenerics } from '../types';

type AppContextType = {
  chatClient: StreamChat<StreamChatGenerics> | null;
  loginUser: (config: LoginConfig) => void;
  logout: () => void;
  unreadCount: number | undefined;
};

export const AppContext = React.createContext({} as AppContextType);

export const useAppContext = () => React.useContext(AppContext);
