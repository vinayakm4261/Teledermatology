import React, { useCallback } from 'react';
import { View } from 'react-native';
import { useField } from 'formik';
import { TextInput, Button } from 'react-native-paper';

import Label from '../Typography/Label';
import Chip from '../Chip';

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

  const handleAddPress = useCallback(() => {
    alert('Show upload modal');
    addValue({ type: 'image', uri: 'abc.jpg' });
  }, []);

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
            onPress={handleAddPress}
            {...buttonProps}
            disabled={disabled}>
            Upload
          </Button>
        </View>
      </>
    ),
    [value, disabled, removeValue, handleAddPress, buttonProps],
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
