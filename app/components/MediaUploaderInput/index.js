import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { useField } from 'formik';
import { TextInput } from 'react-native-paper';

import Label from '../Typography/Label';
import Button from '../Button';
import Chip from '../Chip';
import useMediaPickerDialog from '../../hooks/useMediaPickerDialog';
import useSnackbar from '../../hooks/useSnackbar';

export default function ({
  name,
  label = '',
  disabled = false,
  style = {},
  buttonProps,
}) {
  const [{ value }, { touched, error }, { setValue, setTouched }] = useField(
    name,
  );
  const { showSnackbar, Snackbar } = useSnackbar();
  const [mediaTypeCounter, setMediaTypeCounter] = useState({
    image: 0,
    video: 0,
    audio: 0,
  });

  const changeValue = useCallback(
    (newValue) => {
      setValue(newValue);
      !touched && setTouched(true);
    },
    [touched, setTouched, setValue],
  );

  const removeValue = useCallback(
    (removeIdx) => () => {
      changeValue(value.filter((_, idx) => idx !== removeIdx));
    },
    [value, changeValue],
  );

  const onMediaPicked = useCallback(
    (media) => {
      let newMediaTypeCounter = mediaTypeCounter;
      changeValue([
        ...value,
        ...media.map(({ type, uri }) => ({
          type,
          uri,
          name: `${type.charAt(0).toUpperCase()}${type
            .substr(1)
            .toLowerCase()} ${++newMediaTypeCounter[type]}`,
        })),
      ]);
      setMediaTypeCounter(newMediaTypeCounter);
    },
    [changeValue, mediaTypeCounter],
  );

  const onError = useCallback(() => {
    showSnackbar('An error occurred.');
  });

  const mediaPicker = useMediaPickerDialog({
    onError,
    onPicked: onMediaPicked,
  });

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
                {chip.name}
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
            onPress={mediaPicker.showDialog}
            {...buttonProps}
            disabled={disabled}>
            Upload
          </Button>
        </View>
      </>
    ),
    [value, disabled, removeValue, mediaPicker, buttonProps],
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
      <Snackbar />
      {mediaPicker.dialog}
    </>
  );
}
