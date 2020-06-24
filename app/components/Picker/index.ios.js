import React, { useCallback } from 'react';
import { View, ActionSheetIOS } from 'react-native';
import { useField } from 'formik';
import { TextInput, TouchableRipple, Text } from 'react-native-paper';

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
  const showPicker = useCallback(
    () =>
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', ...items.map((item) => item.label)],
          cancelButtonIndex: 0,
        },
        (selectedIndex) => {
          if (selectedIndex) {
            setValue(items[selectedIndex - 1].value);
            setTouched(true);
          }
        },
      ),
    [items, setValue, setTouched],
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
        onPress={showPicker}>
        <Text style={{ fontSize: 16 }}>
          {items.find((item) => item.value === value)?.label}
        </Text>
      </TouchableRipple>
    ),
    [showPicker, value, items, disabled],
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
