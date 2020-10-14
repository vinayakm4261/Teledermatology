import React, { useState, useCallback } from 'react';
import { View } from 'react-native';
import { useField } from 'formik';
import {
  Portal,
  Text,
  TextInput,
  TouchableRipple,
  Button,
  useTheme,
} from 'react-native-paper';
import Modal from 'react-native-modal';
import moment from 'moment';

import DateRangePicker from './Source';
import Label from '../Typography/Label';

export default function ({
  children,
  name,
  label = '',
  disabled = false,
  style = {},
  ...props
}) {
  const [{ value }, { touched, error }, { setValue, setTouched }] = useField(
    name,
  );
  const [showPicker, setShowPicker] = useState(false);
  const theme = useTheme();

  const handleOpen = useCallback(() => setShowPicker(true), []);

  const handleClose = useCallback(() => setShowPicker(false), []);

  const handleChange = useCallback(
    ([from, to]) => {
      setTouched(true);
      setValue(`${from} | ${to}`);
    },
    [setTouched, setValue],
  );

  const renderInputText = useCallback(
    () => (
      <TouchableRipple
        disabled={disabled}
        style={{
          flexGrow: 1,
          justifyContent: 'center',
          paddingHorizontal: 12,
        }}
        onPress={handleOpen}>
        <Text style={{ fontSize: 16 }}>
          {`${moment(value.split('|')[0].trim()).format(
            'DD/MM/YYYY',
          )} | ${moment(value.split('|')[1].trim()).format('DD/MM/YYYY')}`}
        </Text>
      </TouchableRipple>
    ),
    [value, handleOpen, disabled],
  );

  return (
    <>
      <View style={style}>
        {!!label && <Label>{label}</Label>}
        <TextInput
          mode="flat"
          dense={true}
          style={{
            height: 48,
          }}
          error={touched && error}
          render={renderInputText}
        />
      </View>
      <Portal>
        <Modal
          useNativeDriver
          hideModalContentWhileAnimating
          backdropOpacity={0.25}
          style={{
            justifyContent: 'center',
            padding: 0,
            margin: 0,
          }}
          animationIn="fadeIn"
          animationOut="fadeOut"
          isVisible={showPicker}
          onBackdropPress={handleClose}
          onBackButtonPress={handleClose}
          onModalHide={handleClose}>
          <View
            style={{
              margin: 8,
              padding: 12,
              backgroundColor: 'white',
              zIndex: 100,
              borderRadius: theme.roundness * 2,
            }}>
            <DateRangePicker
              initialRange={[
                moment(value.split('|')[0].trim()).format('YYYY-MM-DD'),
                moment(value.split('|')[1].trim()).format('YYYY-MM-DD'),
              ]}
              onChange={handleChange}
              {...props}
            />
            <Button style={{ marginTop: 8 }} onPress={handleClose}>
              Done
            </Button>
          </View>
        </Modal>
      </Portal>
    </>
  );
}
