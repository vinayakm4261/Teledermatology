import React from 'react';
import { View } from 'react-native';
import { useField } from 'formik';
import { TextInput } from 'react-native-paper';

import Label from '../Typography/Label';

export default function ({
  children,
  name,
  label = '',
  style = {},
  multiline = false,
  ...props
}) {
  const [{ value, onChange, onBlur }, { touched, error }] = useField(name);
  return (
    <View style={style}>
      {!!label && <Label>{label}</Label>}
      <TextInput
        multiline={multiline}
        mode="flat"
        dense={true}
        style={
          !multiline && {
            height: 48,
          }
        }
        error={touched && error}
        onChangeText={onChange(name)}
        onBlur={onBlur(name)}
        value={value}
        {...props}
      />
    </View>
  );
}
