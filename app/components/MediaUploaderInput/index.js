import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { useField } from 'formik';
import { TextInput, useTheme } from 'react-native-paper';
import Modal from 'react-native-modal';
import ImagePicker from 'react-native-image-picker';

import formStyles from '../../forms/styles';
import Caption from '../Typography/Caption';
import Label from '../Typography/Label';
import Button from '../Button';
import Chip from '../Chip';

export default function ({
  name,
  label = '',
  disabled = false,
  style = {},
  buttonProps,
}) {
  const theme = useTheme();
  const [{ value }, { touched, error }, { setValue, setTouched }] = useField(
    name,
  );
  const mediaTypeCounter = useState({ photo: 0, video: 0, audio: 0 });

  const [modalVisible, setModalVisible] = useState(false);

  const changeValue = useCallback(
    (newValue) => {
      setValue(newValue);
      !touched && setTouched(true);
    },
    [touched, setTouched, setValue],
  );

  const addValue = useCallback(
    (item) => {
      !!item && !value.includes(item) && changeValue([...value, item]);
    },
    [changeValue, value],
  );

  const removeValue = useCallback(
    (removeIdx) => () => {
      changeValue(value.filter((_, idx) => idx !== removeIdx));
    },
    [value, changeValue],
  );

  const showMediaPicker = useCallback(() => {
    setModalVisible(true);
  }, [setModalVisible]);

  const closeMediaPicker = useCallback(() => {
    setModalVisible(false);
  }, [setModalVisible]);

  const renderInputText = useCallback(
    () => (
      <>
        {!!value.length && (
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              alignItems: 'center',
              padding: 4,
              paddingBottom: 0,
            }}>
            {value.map((chip, idx) => (
              <Chip
                key={chip.uri}
                disabled={disabled}
                onClose={removeValue(idx)}>
                {chip.uri}
              </Chip>
            ))}
          </View>
        )}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
          }}>
          <Button
            compact
            style={{ height: 36, margin: 6, padding: 0 }}
            labelStyle={{ lineHeight: 20, marginRight: 16 }}
            icon="upload"
            onPress={showMediaPicker}
            {...buttonProps}
            disabled={disabled}>
            Upload
          </Button>
        </View>
      </>
    ),
    [value, disabled, removeValue, showMediaPicker, buttonProps],
  );

  return (
    <>
      <View style={style}>
        <Label>{label}</Label>
        <TextInput
          mode="flat"
          dense={true}
          style={{
            height: 48,
            padding: 0,
          }}
          error={touched && error}
          render={renderInputText}
        />
      </View>
      <Modal
        useNativeDriver
        hideModalContentWhileAnimating
        backdropOpacity={0.25}
        style={{
          justifyContent: 'flex-end',
          padding: 0,
          margin: 0,
        }}
        isVisible={modalVisible}
        swipeDirection={['down']}
        onBackdropPress={closeMediaPicker}
        onBackButtonPress={closeMediaPicker}
        onModalHide={closeMediaPicker}
        onSwipeComplete={closeMediaPicker}>
        <View
          style={{
            margin: 8,
            padding: 12,
            backgroundColor: 'white',
            zIndex: 100,
            borderRadius: theme.roundness * 2,
          }}>
          <Caption>Media Type</Caption>
          <View style={formStyles.inputRow}>
            <Button
              compact
              style={formStyles.inputRowLeft}
              icon="image-outline"
              onPress={() => {
                ImagePicker.showImagePicker(
                  {
                    title: 'Select Image',
                    takePhotoButtonTitle: 'Camera',
                    chooseFromLibraryButtonTitle: 'Choose from Library',
                    mediaType: 'photo',
                    noData: true,
                    storageOptions: {
                      skipBackup: true,
                      cameraRoll: false,
                      privateDirectory: true,
                      waitUntilSaved: true,
                    },
                  },
                  (response) => {
                    if (!(response.error || response.didCancel))
                      console.log(response.uri);
                  },
                );
              }}
              mode="contained">
              Photo
            </Button>
            <Button
              compact
              style={formStyles.inputRowRight}
              icon="video-outline"
              onPress={() => {
                ImagePicker.showImagePicker(
                  {
                    title: 'Select Video',
                    takePhotoButtonTitle: 'Camera',
                    chooseFromLibraryButtonTitle: 'Choose from Library',
                    mediaType: 'video',
                    noData: true,
                    storageOptions: {
                      skipBackup: true,
                      cameraRoll: false,
                      privateDirectory: true,
                      waitUntilSaved: true,
                    },
                  },
                  (response) => {
                    if (!(response.error || response.didCancel))
                      console.log(response.uri);
                  },
                );
              }}
              mode="contained">
              Video
            </Button>
          </View>
          <Button
            compact
            style={{ marginTop: 8 }}
            icon="microphone"
            onPress={() => {
              alert('Garam Hai');
            }}
            mode="contained">
            Audio
          </Button>
        </View>
      </Modal>
    </>
  );
}
