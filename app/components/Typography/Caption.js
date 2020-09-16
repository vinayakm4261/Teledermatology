import React from 'react';
import { Caption, useTheme } from 'react-native-paper';

export default function ({ children, style, small = false }) {
  const theme = useTheme();

  return (
    <Caption
      style={{
        fontSize: small ? 12 : 16,
        lineHeight: 24,
        letterSpacing: 0,
        color: theme.colors.grey,
        ...theme.fonts.regular,
        ...style,
      }}>
      {children}
    </Caption>
  );
}
