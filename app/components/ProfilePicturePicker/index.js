import React, { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { FAB } from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';

import Caption from '../Typography/Caption';
import BottomModal from '../BottomModal';

const noOp = () => {};

const ProfilePicturePicker = ({ visible, onDismiss, onPicked }) => {
  const handlePicked = useCallback(
    (media) => {
      onDismiss();
      onPicked({ uri: media.path, type: media.mime });
    },
    [onPicked, onDismiss],
  );

  const captureImage = useCallback(() => {
    ImagePicker.openCamera({
      compressImageQuality: 0.75,
      mediaType: 'photo',
      cropping: true,
    })
      .then(handlePicked)
      .catch(noOp);
  }, [handlePicked]);

  const selectFromGallery = useCallback(() => {
    ImagePicker.openPicker({
      compressImageQuality: 0.75,
      mediaType: 'photo',
      cropping: true,
    })
      .then(handlePicked)
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
        icon: 'image',
        label: 'Gallery',
        onPress: selectFromGallery,
        bgColor: '#DECCFF',
        color: '#7E49FE',
      },
    ],
    [captureImage, selectFromGallery],
  );

  return (
    <BottomModal {...{ visible, onDismiss }}>
      <View style={styles.buttonsGroup}>
        {buttons.map(({ icon, label, bgColor, color, onPress }) => (
          <View key={icon} style={styles.buttonContainer}>
            <FAB
              {...{ icon, onPress, color, style: styles.button }}
              theme={{ colors: { accent: bgColor } }}
            />
            <Caption small style={{ ...styles.bottonLabel, color }}>
              {label.toUpperCase()}
            </Caption>
          </View>
        ))}
      </View>
    </BottomModal>
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

export default ProfilePicturePicker;
