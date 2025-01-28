import React, { useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation, useScrollToTop } from '@react-navigation/native';
import {
  ChannelList,
  ChannelPreviewTitleProps,
  CircleClose,
  Search,
  useTheme,
} from 'stream-chat-react-native';
import { Channel } from 'stream-chat';
import { ChannelPreview } from '../components/ChannelPreview';
import { ChatScreenHeader } from '../components/ChatScreenHeader';
import { MessageSearchList } from '../components/MessageSearch/MessageSearchList';
import { useAppContext } from '../context/AppContext';
import { usePaginatedSearchedMessages } from '../hooks/usePaginatedSearchedMessages';

import type { ChannelSort } from 'stream-chat';

import type { StreamChatGenerics } from '../types';
import { MapPin } from 'react-native-feather';
import { rfq } from '../api/query/rfq.query';
import { user } from '../api/query/user.query';
import { isPm, isVendor } from '../utils/user.util';

const styles = StyleSheet.create({
  channelListContainer: {
    height: '100%',
    position: 'absolute',
    width: '100%',
  },
  emptyIndicatorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  emptyIndicatorText: { paddingTop: 28 },
  flex: {
    flex: 1,
  },
  searchContainer: {
    alignItems: 'center',
    borderRadius: 30,
    borderWidth: 1,
    flexDirection: 'row',
    margin: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    includeFontPadding: false, // for android vertical text centering
    padding: 0, // removal of default text input padding on android
    paddingHorizontal: 10,
    paddingTop: 0, // removal of iOS top padding for weird centering
    textAlignVertical: 'center', // for android vertical text centering
  },
  PreviewTitle: {
    flexShrink: 1,
    gap: 2,
  },
  displayName: {
    fontSize: 16,
    fontWeight: '600',
  },
  displayAddressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f4f5f5',
    padding: 8,
    borderRadius: 16,
    alignSelf: 'flex-start',
    flexGrow: 0,
    width: 'auto',
    marginBottom: 4,
  },
  displayAddress: {
    fontSize: 12,
    fontWeight: '400',
    flexGrow: 0,
  },
});

const sort: ChannelSort<StreamChatGenerics> = { has_unread: -1 };
const options = {
  presence: true,
  state: true,
  watch: true,
};

const CustomPreviewTitle = (prop: ChannelPreviewTitleProps<StreamChatGenerics>) => {
  const { channel } = prop;
  const {
    theme: {
      colors: { grey_dark },
    },
  } = useTheme();
  const { data: userDetail } = user.query.useGet();

  const isVendorUser = isVendor(userDetail);
  const isPmUser = isPm(userDetail);

  const rfqId = Number(channel.data?.rfq_id);
  const enableVendorQueries = isVendorUser && channel.type === 'rfq_chat';
  const enablePmQueries = isPmUser && channel.type === 'rfq_chat';

  const vendorRfqQuery = rfq.query.useGet(rfqId, {
    enabled: enableVendorQueries,
  });

  const pmRfqQuery = rfq.query.useGetPmRfq(rfqId, {
    enabled: enablePmQueries,
  });

  const vendorRfq = vendorRfqQuery.data;
  const pmRfq = pmRfqQuery.data;

  const rfqDetail = vendorRfq || pmRfq;

  return (
    <View style={styles.PreviewTitle}>
      <Text style={styles.displayName}>{prop.displayName}</Text>
      {rfqDetail && (
        <>
          {rfqDetail.properties?.slice(0, 2).map((property) => {
            return (
              <View style={styles.displayAddressContainer} key={property.id}>
                <MapPin height={12} width={12} color={grey_dark} />
                <Text style={styles.displayAddress}>{property.address.display}</Text>
              </View>
            );
          })}
          {rfqDetail.properties?.length && rfqDetail.properties.length > 2 && (
            <View style={styles.displayAddressContainer}>
              <MapPin height={12} width={12} color={grey_dark} />
              <Text style={styles.displayAddress}>{`+${
                rfqDetail.properties.length - 2
              } more`}</Text>
            </View>
          )}
        </>
      )}
    </View>
  );
};

export const ChannelListScreen: React.FC = () => {
  const { chatClient } = useAppContext();
  const navigation = useNavigation();
  const {
    theme: {
      colors: { black, grey, grey_gainsboro, grey_whisper, white, white_snow },
    },
  } = useTheme();

  const searchInputRef = useRef<TextInput | null>(null);
  const scrollRef = useRef<FlatList<Channel<StreamChatGenerics>> | null>(null);

  const [searchInputText, setSearchInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const { loading, loadMore, messages, refreshing, refreshList, reset } =
    usePaginatedSearchedMessages(searchQuery);

  const chatClientUserId = chatClient?.user?.id;

  useScrollToTop(scrollRef);

  // eslint-disable-next-line react/no-unstable-nested-components
  const EmptySearchIndicator = () => (
    <View style={styles.emptyIndicatorContainer}>
      <Search height={112} pathFill={grey_gainsboro} width={112} />
      <Text style={[styles.emptyIndicatorText, { color: grey }]}>
        {`No results for "${searchQuery}"`}
      </Text>
    </View>
  );

  const setScrollRef = (ref: React.RefObject<FlatList<Channel<StreamChatGenerics>> | null>) => {
    scrollRef.current = ref;
  };

  if (!chatClient) {
    return null;
  }

  const filters = {
    members: { $in: [chatClientUserId] },
    ...(searchInputText.trim() ? { name: { $autocomplete: searchInputText.trim() } } : {}),
    type: { $in: ['rfq_chat', 'pm_vendor', 'marketing', 'pitch'] },
  };

  return (
    <View
      style={[
        styles.flex,
        {
          backgroundColor: white_snow,
        },
      ]}
    >
      <ChatScreenHeader />

      <View style={styles.flex}>
        <View
          style={[
            styles.searchContainer,
            {
              backgroundColor: white,
              borderColor: grey_whisper,
            },
          ]}
        >
          <Search pathFill={black} />
          <TextInput
            onChangeText={(text) => {
              setSearchInputText(text);
              if (!text) {
                reset();
                setSearchQuery('');
              }
            }}
            onSubmitEditing={({ nativeEvent: { text } }) => {
              setSearchQuery(text);
            }}
            placeholder='Search'
            placeholderTextColor={grey}
            ref={searchInputRef}
            returnKeyType='search'
            style={[styles.searchInput, { color: black }]}
            value={searchInputText}
          />
          {!!searchInputText && (
            <TouchableOpacity
              onPress={() => {
                setSearchInputText('');
                setSearchQuery('');
                if (searchInputRef.current) {
                  searchInputRef.current.blur();
                }
                reset();
              }}
            >
              <CircleClose pathFill={grey} />
            </TouchableOpacity>
          )}
        </View>
        {(!!searchQuery || (messages && messages.length > 0)) && (
          <MessageSearchList
            EmptySearchIndicator={EmptySearchIndicator}
            loading={loading}
            loadMore={loadMore}
            messages={messages}
            ref={scrollRef}
            refreshing={refreshing}
            refreshList={refreshList}
            showResultCount
          />
        )}
        <View style={{ flex: searchQuery ? 0 : 1 }}>
          <View style={[styles.channelListContainer, { opacity: searchQuery ? 0 : 1 }]}>
            <ChannelList<StreamChatGenerics>
              additionalFlatListProps={{
                getItemLayout: (_, index) => ({
                  index,
                  length: 65,
                  offset: 65 * index,
                }),
                keyboardDismissMode: 'on-drag',
              }}
              filters={filters}
              HeaderNetworkDownIndicator={() => null}
              maxUnreadCount={99}
              onSelect={(channel) => {
                navigation.navigate('ChannelScreen', {
                  channel,
                });
              }}
              options={options}
              Preview={ChannelPreview}
              setFlatListRef={setScrollRef}
              sort={sort}
              PreviewTitle={CustomPreviewTitle}
            />
          </View>
        </View>
      </View>
    </View>
  );
};
