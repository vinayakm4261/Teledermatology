import React from 'react';
import { Title, useTheme } from 'react-native-paper';

export default function ({ children, style }) {
  const theme = useTheme();

  return (
    <Title
      style={{
        fontSize: 26,
        lineHeight: 32,
        marginVertical: 8,
        letterSpacing: -0.5,
        color: theme.colors.greyPrimary,
        ...theme.fonts.medium,
        ...style,
      }}>
      {children}
    </Title>
  );
}
