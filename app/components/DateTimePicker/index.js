import React, { useState, useCallback } from 'react';
import { View } from 'react-native';
import { useField } from 'formik';
import { Text, TextInput, TouchableRipple } from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import Label from '../Typography/Label';

const formatDate = (date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return [
    (day > 9 ? '' : '0') + day,
    (month > 9 ? '' : '0') + month,
    year,
  ].join('/');
};

export default function ({
  children,
  name,
  mode = 'date',
  label = '',
  disabled = false,
  style = {},
  ...props
}) {
  const [{ value }, { touched, error }, { setValue, setTouched }] = useField(
    name,
  );
  const [showPicker, setShowPicker] = useState(false);

  const handleOpen = useCallback(() => setShowPicker(true), []);

  const handleCancel = useCallback(() => setShowPicker(false), []);

  const handleConfirm = useCallback(
    (date) => {
      handleCancel();
      setTouched(true);
      setValue(date);
    },
    [handleCancel, setTouched, setValue],
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
        <Text style={{ fontSize: 16 }}>{formatDate(value)}</Text>
      </TouchableRipple>
    ),
    [value, handleOpen, disabled],
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
          }}
          error={touched && error}
          render={renderInputText}
        />
      </View>
      <DateTimePickerModal
        isVisible={showPicker}
        date={value}
        mode={mode}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        {...props}
      />
    </>
  );
}
