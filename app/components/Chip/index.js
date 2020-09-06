import React from 'react';
import { Chip, useTheme } from 'react-native-paper';

export default ({ children, style, ...props }) => {
  const theme = useTheme();

  return (
    <Chip
      style={{
        margin: 2,
        borderRadius: 6,
        backgroundColor: theme.colors.surface,
        ...style,
      }}
      {...props}>
      {children}
    </Chip>
  );
};
