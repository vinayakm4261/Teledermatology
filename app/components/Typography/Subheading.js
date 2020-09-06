import React from 'react';
import { Subheading, useTheme } from 'react-native-paper';

export default function ({ children, style }) {
  const theme = useTheme();

  return (
    <Subheading
      style={{
        fontSize: 18,
        lineHeight: 24,
        color: theme.colors.primaryDark,
        ...theme.fonts.medium,
        ...style,
      }}>
      {children}
    </Subheading>
  );
}
