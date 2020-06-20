import React from 'react';
import { Caption, useTheme } from 'react-native-paper';

export default function ({ children, style }) {
  const theme = useTheme();

  return (
    <Caption
      style={{
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 0,
        marginTop: 8,
        marginHorizontal: 8,
        color: '#B2B2B2',
        letterSpacing: -0.5,
        ...theme.fonts.medium,
        ...style,
      }}>
      {children}
    </Caption>
  );
}
