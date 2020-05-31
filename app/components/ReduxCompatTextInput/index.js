import React from 'react';
import { TextInput } from '../index';

export default function ({ input, ...inputProps }) {
  return (
    <TextInput
      {...inputProps}
      onChangeText={input.onChange}
      onBlur={input.onBlur}
      onFocus={input.onFocus}
      value={input.value}
    />
  );
}
