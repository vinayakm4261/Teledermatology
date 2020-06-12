import React, { useCallback } from 'react';
import { View } from 'react-native';
import { Picker } from '@react-native-community/picker';
import { useField } from 'formik';
import { TextInput } from 'react-native-paper';

import Label from '../Typography/Label';

export default function ({
  name,
  items,
  label = '',
  disabled = false,
  style = {},
}) {
  const [{ value }, { touched, error }, { setValue, setTouched }] = useField(
    name,
  );

  const handleValueChange = useCallback(
    (newValue) => {
      setValue(newValue);
      setTouched(true);
    },
    [setTouched, setValue],
  );

  const renderInputText = useCallback(
    () => (
      <Picker
        enabled={!disabled}
        style={{ marginLeft: 4, height: 48 }}
        mode="dropdown"
        selectedValue={value}
        onValueChange={handleValueChange}>
        {items.map((item) => (
          <Picker.Item key={item.value} {...item} />
        ))}
      </Picker>
    ),
    [value, items, handleValueChange, disabled],
  );

  return (
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
  );
}
