import React, { useMemo, useCallback } from 'react';
import { View } from 'react-native';
import { FAB } from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';

import Label from '../Typography/Label';
import Subheading from '../Typography/Subheading';
import BottomModal from '../BottomModal';
import useAudioRecorderDialog from '../../hooks/useAudioRecorderDialog';

const noOp = () => {};

export default ({ visible, onDismiss, onPicked, onError }) => {
  const handlePicked = useCallback(
    (media) => {
      onDismiss();
      onPicked(media);
    },
    [onDismiss, onPicked],
  );

  const handleAudioRecorded = useCallback(
    (file) => {
      handlePicked([{ uri: `file://${file}`, type: 'audio' }]);
    },
    [handlePicked],
  );

  const audioRecorder = useAudioRecorderDialog({
    onError,
    onRecorded: handleAudioRecorded,
  });

  const captureImage = useCallback(() => {
    ImagePicker.openCamera({
      multiple: true,
      compressImageQuality: 0.75,
      mediaType: 'photo',
      cropping: true,
    })
      .then((images) => {
        handlePicked(
          images.map((image) => ({
            uri: image.path,
            type: 'image',
          })),
        );
      })
      .catch(noOp);
  }, [handlePicked]);

  const captureVideo = useCallback(() => {
    ImagePicker.openCamera({
      multiple: true,
      mediaType: 'video',
    })
      .then((videos) => {
        handlePicked(
          videos.map((video) => ({
            uri: video.path,
            type: 'video',
          })),
        );
      })
      .catch(noOp);
  }, [handlePicked]);

  const selectFromGallery = useCallback(() => {
    ImagePicker.openPicker({
      multiple: true,
      compressImageQuality: 0.75,
      mediaType: 'any',
    })
      .then((files) => {
        handlePicked(
          files.map((file) => ({
            uri: file.path,
            type: file.mime.split('/')[0],
          })),
        );
      })
      .catch(noOp);
  }, [handlePicked]);

  const buttons = useMemo(
    () => [
      {
        icon: 'camera',
        label: 'PHOTO',
        onPress: captureImage,
      },
      {
        icon: 'video',
        label: 'VIDEO',
        onPress: captureVideo,
      },
      {
        icon: 'image',
        label: 'GALLERY',
        onPress: selectFromGallery,
      },
      {
        icon: 'microphone',
        label: 'VOICE',
        onPress: audioRecorder.showDialog,
      },
    ],
    [captureImage, captureVideo, selectFromGallery, audioRecorder],
  );

  return (
    <>
      <BottomModal {...{ visible, onDismiss }}>
        <Subheading>Select Media Type</Subheading>
        <View style={styles.buttonsGroup}>
          {buttons.map(({ icon, label, onPress }) => (
            <View key={icon} style={styles.buttonContainer}>
              <FAB icon={icon} style={styles.button} onPress={onPress} />
              <Label style={styles.bottonLabel}>{label}</Label>
            </View>
          ))}
        </View>
      </BottomModal>
      {audioRecorder.dialog}
    </>
  );
};

const styles = {
  buttonsGroup: {
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    margin: 8,
    alignItems: 'center',
    flexGrow: 1,
  },
  button: {
    elevation: 1,
  },
  bottonLabel: {
    margin: 0,
  },
};
