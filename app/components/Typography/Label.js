import React from 'react';
import { Caption } from 'react-native-paper';

export default function ({ children }) {
  return (
    <Caption
      style={{
        fontSize: 14,
        lineHeight: 14,
        marginBottom: 0,
        marginTop: 8,
        marginHorizontal: 8,
        fontWeight: '700',
        color: '#B2B2B2',
      }}>
      {children}
    </Caption>
  );
}
