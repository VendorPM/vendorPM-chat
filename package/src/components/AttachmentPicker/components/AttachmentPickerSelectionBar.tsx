import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import {
  useChannelContext,
  useMessagesContext,
  useOwnCapabilitiesContext,
} from '../../../contexts';
import { useAttachmentPickerContext } from '../../../contexts/attachmentPickerContext/AttachmentPickerContext';
import { useMessageInputContext } from '../../../contexts/messageInputContext/MessageInputContext';
import { useTheme } from '../../../contexts/themeContext/ThemeContext';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 6,
  },
  icon: {
    marginHorizontal: 12,
  },
});

export const AttachmentPickerSelectionBar = () => {
  const {
    attachmentSelectionBarHeight,
    CameraSelectorIcon,
    closePicker,
    CreatePollIcon,
    FileSelectorIcon,
    ImageSelectorIcon,
    selectedPicker,
    setSelectedPicker,
  } = useAttachmentPickerContext();

  const {
    hasCameraPicker,
    hasFilePicker,
    imageUploads,
    openPollCreationDialog,
    pickFile,
    sendMessage,
    takeAndUploadImage,
  } = useMessageInputContext();
  const { threadList } = useChannelContext();
  const { hasCreatePoll } = useMessagesContext();
  const ownCapabilities = useOwnCapabilitiesContext();

  const {
    theme: {
      attachmentSelectionBar: { container, icon },
    },
  } = useTheme();

  const setImagePicker = () => {
    if (selectedPicker === 'images') {
      setSelectedPicker(undefined);
      closePicker();
    } else {
      setSelectedPicker('images');
    }
  };

  const openFilePicker = () => {
    setSelectedPicker(undefined);
    closePicker();
    pickFile();
  };

  const openPollCreationModal = () => {
    setSelectedPicker(undefined);
    closePicker();
    openPollCreationDialog?.({ sendMessage });
  };

  return (
    <View style={[styles.container, container, { height: attachmentSelectionBarHeight }]}>
      <TouchableOpacity
        hitSlop={{ bottom: 15, top: 15 }}
        onPress={setImagePicker}
        testID='upload-photo-touchable'
      >
        <View style={[styles.icon, icon]}>
          <ImageSelectorIcon
            numberOfImageUploads={imageUploads.length}
            selectedPicker={selectedPicker}
          />
        </View>
      </TouchableOpacity>
      {hasFilePicker ? (
        <TouchableOpacity
          hitSlop={{ bottom: 15, top: 15 }}
          onPress={openFilePicker}
          testID='upload-file-touchable'
        >
          <View style={[styles.icon, icon]}>
            <FileSelectorIcon
              numberOfImageUploads={imageUploads.length}
              selectedPicker={selectedPicker}
            />
          </View>
        </TouchableOpacity>
      ) : null}
      {hasCameraPicker ? (
        <TouchableOpacity
          hitSlop={{ bottom: 15, top: 15 }}
          onPress={takeAndUploadImage}
          testID='take-photo-touchable'
        >
          <View style={[styles.icon, icon]}>
            <CameraSelectorIcon
              numberOfImageUploads={imageUploads.length}
              selectedPicker={selectedPicker}
            />
          </View>
        </TouchableOpacity>
      ) : null}
      {!threadList && hasCreatePoll && ownCapabilities.sendPoll ? ( // do not allow poll creation in threads
        <TouchableOpacity
          hitSlop={{ bottom: 15, top: 15 }}
          onPress={openPollCreationModal}
          testID='create-poll-touchable'
        >
          <View style={[styles.icon, icon]}>
            <CreatePollIcon />
          </View>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};
