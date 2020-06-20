import React from 'react';
import { Text } from 'react-native';
import { useTheme } from 'react-native-paper';

export default function ({ children, style }) {
  const theme = useTheme();

  return (
    <Text
      style={{
        color: theme.colors.primary,
        fontSize: 36,
        lineHeight: 48,
        marginTop: 12,
        marginBottom: 16,
        letterSpacing: -0.5,
        ...theme.fonts.medium,
        ...style,
      }}>
      {children}
    </Text>
  );
}
