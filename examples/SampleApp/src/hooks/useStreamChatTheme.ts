import { useEffect, useState } from 'react';
import { ColorSchemeName, useColorScheme } from 'react-native';
import type { DeepPartial, Theme } from 'stream-chat-react-native';

const getChatStyle = (colorScheme: ColorSchemeName): DeepPartial<Theme> => ({
  colors:
    colorScheme === 'dark'
      ? {
          accent_blue: '#0b64e0',
          accent_green: '#20E070',
          accent_red: '#FF3742',
          bg_gradient_end: '#F7F7F7',
          bg_gradient_start: '#FCFCFC',
          black: '#000000',
          blue_alice: '#E9F2FF',
          border: '#00000014', // 14 = 8% opacity; top: x=0, y=-1; bottom: x=0, y=1
          button_background: '#0b64e0',
          button_text: '#FFFFFF',
          grey: '#7A7A7A',
          grey_gainsboro: '#DBDBDB',
          grey_whisper: '#ECEBEB',
          icon_background: '#FFFFFF',
          modal_shadow: '#00000099', // 99 = 60% opacity; x=0, y= 1, radius=4
          overlay: '#00000099', // 99 = 60% opacity
          shadow_icon: '#00000040', // 40 = 25% opacity; x=0, y=0, radius=4
          targetedMessageBackground: '#FBF4DD', // dark mode = #302D22
          text_high_emphasis: '#080707',
          text_low_emphasis: '#7E828B',
          transparent: 'transparent',
          white: '#FFFFFF',
          white_smoke: '#F2F2F2',
          white_snow: '#FCFCFC',
        }
      : {
          accent_blue: '#0b64e0',
          accent_green: '#20E070',
          accent_red: '#FF3742',
          bg_gradient_end: '#F7F7F7',
          bg_gradient_start: '#FCFCFC',
          black: '#000000',
          blue_alice: '#E9F2FF',
          border: '#00000014', // 14 = 8% opacity; top: x=0, y=-1; bottom: x=0, y=1
          button_background: '#0b64e0',
          button_text: '#FFFFFF',
          grey: '#7A7A7A',
          grey_gainsboro: '#DBDBDB',
          grey_whisper: '#ECEBEB',
          icon_background: '#FFFFFF',
          modal_shadow: '#00000099', // 99 = 60% opacity; x=0, y= 1, radius=4
          overlay: '#00000099', // 99 = 60% opacity
          shadow_icon: '#00000040', // 40 = 25% opacity; x=0, y=0, radius=4
          targetedMessageBackground: '#FBF4DD', // dark mode = #302D22
          text_high_emphasis: '#080707',
          text_low_emphasis: '#7E828B',
          transparent: 'transparent',
          white: '#FFFFFF',
          white_smoke: '#F2F2F2',
          white_snow: '#FCFCFC',
        },
  channelPreview: {
    container: {
      backgroundColor: 'transparent',
      borderBottomWidth: 0,
      alignItems: 'center',
    },
    row: {
      alignItems: 'flex-start',
      paddingLeft: 12,
      gap: 8,
    },
    contentContainer: {
      gap: 8,
    },
  },
  ...(colorScheme === 'dark' ? {} : {}),
});

export const useStreamChatTheme = () => {
  const colorScheme = useColorScheme();

  const [chatStyle, setChatStyle] = useState(getChatStyle(colorScheme));

  useEffect(() => {
    setChatStyle(getChatStyle(colorScheme));
  }, [colorScheme]);

  return chatStyle;
};
