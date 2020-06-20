import React from 'react';
import { Button, useTheme } from 'react-native-paper';

export default function ({ children, ...props }) {
  const theme = useTheme();

  return (
    <Button
      {...props}
      contentStyle={{
        height: 48,
      }}
      labelStyle={{
        fontSize: 16,
        ...theme.fonts.medium,
      }}>
      {children}
    </Button>
  );
}
