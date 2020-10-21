import React from 'react';
import { Button, useTheme } from 'react-native-paper';

export default function ({ children, compact, ...props }) {
  const theme = useTheme();

  return (
    <Button
      {...props}
      contentStyle={
        compact
          ? props?.contentStyle
          : {
              height: 48,
              ...props?.contentStyle,
            }
      }
      labelStyle={
        compact
          ? props?.labelStyle
          : {
              fontSize: 16,
              ...theme.fonts.medium,
              ...props?.labelStyle,
            }
      }>
      {children}
    </Button>
  );
}
