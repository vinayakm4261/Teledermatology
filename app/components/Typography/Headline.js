import React from 'react';
import {Headline} from 'react-native-paper';

export default function ({children}) {
  return (
    <Headline
      style={{
        fontSize: 28,
        lineHeight: 32,
        marginVertical: 8,
        fontWeight: '700',
        color: '#696969',
      }}>
      {children}
    </Headline>
  );
}
