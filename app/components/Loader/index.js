import React from 'react';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

export default ({
  renderIndicator = false,
  indicatorProps,
  style,
  loaded,
  children,
  ...props
}) =>
  loaded ? (
    children()
  ) : (
    <View style={{ flex: 1, justifyContent: 'center', ...style }}>
      {renderIndicator ? (
        renderIndicator()
      ) : (
        <ActivityIndicator size="large" {...indicatorProps} />
      )}
    </View>
  );
