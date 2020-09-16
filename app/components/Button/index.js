import React from 'react';
import { Button, useTheme } from 'react-native-paper';

export default function ({ children, compact, ...props }) {
  const theme = useTheme();

  return (
    <Button
      {...props}
      contentStyle={
        compact
          ? null
          : {
              height: 48,
            }
      }
      labelStyle={
        compact
          ? null
          : {
              fontSize: 16,
              ...theme.fonts.medium,
            }
      }>
      {children}
    </Button>
  );
}
