import React, { useMemo, useCallback } from 'react';
import { View } from 'react-native';
import { FAB } from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';

import Caption from '../Typography/Caption';
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
        label: 'Photo',
        onPress: captureImage,
        bgColor: '#D1E1FE',
        color: '#5294FD',
      },
      {
        icon: 'video',
        label: 'Video',
        onPress: captureVideo,
        bgColor: '#FECCD5',
        color: '#FD3D65',
      },
      {
        icon: 'image',
        label: 'Gallery',
        onPress: selectFromGallery,
        bgColor: '#DECCFF',
        color: '#7E49FE',
      },
      {
        icon: 'microphone',
        label: 'Voice',
        onPress: audioRecorder.showDialog,
        bgColor: '#FED3C6',
        color: '#FA673B',
      },
    ],
    [captureImage, captureVideo, selectFromGallery, audioRecorder],
  );

  return (
    <>
      <BottomModal {...{ visible, onDismiss }}>
        <View style={styles.buttonsGroup}>
          {buttons.map(({ icon, label, bgColor, color, onPress }) => (
            <View key={icon} style={styles.buttonContainer}>
              <FAB
                icon={icon}
                style={styles.button}
                onPress={onPress}
                theme={{ colors: { accent: bgColor } }}
                color={color}
              />
              <Caption small style={{ ...styles.bottonLabel, color }}>
                {label.toUpperCase()}
              </Caption>
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
    margin: 8,
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
    elevation: 0,
  },
  bottonLabel: {
    margin: 0,
  },
};
