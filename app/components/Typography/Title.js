import React from 'react';
import {Title} from 'react-native-paper';

export default function ({children}) {
  return (
    <Title
      style={{
        fontSize: 26,
        lineHeight: 32,
        marginVertical: 8,
        color: '#3F3D56',
      }}>
      {children}
    </Title>
  );
}
