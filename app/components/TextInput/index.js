import React from 'react';
import { TextInput } from 'react-native-paper';

export default function ({ children, ...props }) {
  return (
    <TextInput
      {...props}
      mode="flat"
      dense={true}
      style={{
        height: 48,
      }}
    />
  );
}
