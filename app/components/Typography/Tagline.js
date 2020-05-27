import React from 'react';
import {Text} from 'react-native';
import {useTheme} from 'react-native-paper';

export default function ({children}) {
  const theme = useTheme();
  return (
    <Text
      style={{
        color: theme.colors.primary,
        fontWeight: '700',
        fontSize: 36,
        lineHeight: 36,
        marginTop: 12,
        marginBottom: 16,
      }}>
      {children}
    </Text>
  );
}
