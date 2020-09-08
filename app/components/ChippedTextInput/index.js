import React, { useState, useCallback } from 'react';
import { View, TextInput as NativeTextInput } from 'react-native';
import { useField } from 'formik';
import { TextInput, useTheme, Button } from 'react-native-paper';

import Label from '../Typography/Label';
import Chip from '../Chip';

export default function ({
  name,
  items,
  label = '',
  disabled = false,
  style = {},
  buttonProps,
  ...props
}) {
  const theme = useTheme();
  const [{ value }, { touched, error }, { setValue, setTouched }] = useField(
    name,
  );
  const [currentText, setCurrentText] = useState('');

  const changeValue = useCallback(
    (newValue) => {
      setValue(newValue);
      !touched && setTouched(true);
    },
    [touched, setTouched, setValue],
  );

  const addValue = useCallback(
    (rawItem) => {
      const newItem = rawItem.trim();
      !!newItem && !value.includes(newItem) && changeValue([...value, newItem]);
    },
    [changeValue, value],
  );

  const removeValue = useCallback(
    (removeIdx) => () => {
      changeValue(value.filter((_, idx) => idx !== removeIdx));
    },
    [value, changeValue],
  );

  const handleAddPress = useCallback(() => {
    addValue(currentText);
    setCurrentText('');
  }, [addValue, currentText]);

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
              <Chip key={chip} disabled={disabled} onClose={removeValue(idx)}>
                {chip}
              </Chip>
            ))}
          </View>
        )}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <NativeTextInput
            value={currentText}
            onChangeText={setCurrentText}
            placeholderTextColor={theme.colors.placeholder}
            style={{
              flexGrow: 1,
              margin: 0,
              height: 48,
              padding: 12,
              fontSize: 16,
              ...theme.fonts.regular,
            }}
            selectionColor={theme.colors.primary}
            underlineColorAndroid="transparent"
            editable={!disabled}
            {...props}
          />
          <Button
            style={{ height: 36, margin: 6, padding: 0 }}
            labelStyle={{ lineHeight: 20 }}
            compact={true}
            icon="plus"
            onPress={handleAddPress}
            {...buttonProps}
            disabled={disabled || !currentText}>
            Add
          </Button>
        </View>
      </>
    ),
    [
      value,
      theme,
      disabled,
      props,
      removeValue,
      currentText,
      handleAddPress,
      buttonProps,
    ],
  );

  return (
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
  );
}
