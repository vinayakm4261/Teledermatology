import React from 'react';
import { View } from 'react-native';
import { useTheme, Portal } from 'react-native-paper';
import Modal from 'react-native-modal';
import ImagePicker from 'react-native-image-crop-picker';

import formStyles from '../../forms/styles';
import Subheading from '../Typography/Subheading';
import Button from '../Button';
import useAudioRecorderDialog from '../../hooks/useAudioRecorderDialog';

export default function ({ visible, onDismiss, onPicked, onError }) {
  const theme = useTheme();
  const {
    showDialog: showAudioRecorderDialog,
    dialog: audioRecorderDialog,
  } = useAudioRecorderDialog({
    onError,
    onRecorded: (file) => {
      onPicked([{ uri: `file://${file}`, type: 'audio' }]);
    },
  });

  return (
    <>
      <Portal>
        <Modal
          useNativeDriver
          hideModalContentWhileAnimating
          backdropOpacity={0.25}
          style={{
            justifyContent: 'flex-end',
            padding: 0,
            margin: 0,
          }}
          isVisible={visible}
          swipeDirectvision={['down']}
          onBackdropPress={onDismiss}
          onBackButtonPress={onDismiss}
          onModalHide={onDismiss}
          onSwipeComplete={onDismiss}>
          <View
            style={{
              margin: 8,
              padding: 12,
              backgroundColor: 'white',
              zIndex: 100,
              borderRadius: theme.roundness * 2,
            }}>
            <Subheading>Select Media Type</Subheading>
            <View style={[formStyles.inputRow, { marginBottom: 8 }]}>
              <Button
                compact
                style={formStyles.inputRowLeft}
                icon="camera"
                onPress={() => {
                  ImagePicker.openCamera({
                    multiple: true,
                    compressImageQuality: 0.75,
                    mediaType: 'photo',
                    cropping: true,
                  }).then((images) => {
                    onDismiss();
                    console.log(images);
                    onPicked(
                      images.map((image) => ({
                        uri: image.path,
                        type: 'image',
                      })),
                    );
                  });
                }}
                mode="contained">
                Photo
              </Button>
              <Button
                compact
                style={formStyles.inputRowRight}
                icon="video"
                onPress={() => {
                  ImagePicker.openCamera({
                    multiple: true,
                    mediaType: 'video',
                  }).then((videos) => {
                    onDismiss();
                    onPicked(
                      videos.map((video) => ({
                        uri: video.path,
                        type: 'video',
                      })),
                    );
                  });
                }}
                mode="contained">
                Video
              </Button>
            </View>
            <View style={formStyles.inputRow}>
              <Button
                compact
                style={formStyles.inputRowLeft}
                icon="image"
                onPress={() => {
                  ImagePicker.openPicker({
                    multiple: true,
                    compressImageQuality: 0.75,
                    mediaType: 'any',
                  }).then((files) => {
                    onDismiss();
                    onPicked(
                      files.map((file) => ({
                        uri: file.path,
                        type: file.mime.split('/')[0],
                      })),
                    );
                  });
                }}
                mode="contained">
                Gallery
              </Button>
              <Button
                compact
                style={formStyles.inputRowRight}
                icon="microphone"
                onPress={() => {
                  onDismiss();
                  showAudioRecorderDialog();
                }}
                mode="contained">
                Voice
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>
      {audioRecorderDialog}
    </>
  );
}
