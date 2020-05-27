import React from 'react';
import { Button } from 'react-native-paper';

export default function ({ children, ...props }) {
  return (
    <Button
      {...props}
      contentStyle={{
        height: 48,
      }}
      labelStyle={{
        fontSize: 16,
        fontWeight: '700',
      }}>
      {children}
    </Button>
  );
}
