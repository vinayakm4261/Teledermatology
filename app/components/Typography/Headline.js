import React from 'react';
import { Headline, useTheme } from 'react-native-paper';

export default function ({ children, style }) {
  const theme = useTheme();

  return (
    <Headline
      style={{
        fontSize: 28,
        lineHeight: 36,
        marginVertical: 8,
        letterSpacing: -0.5,
        color: theme.colors.greyDark,
        ...theme.fonts.medium,
        ...style,
      }}>
      {children}
    </Headline>
  );
}
