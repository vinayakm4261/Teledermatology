import React, { useRef } from 'react';
import { StatusBar, SafeAreaView, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { useTheme } from 'react-native-paper';

import Appbar from '../Appbar';

export const HEADER_HEIGHT = 56;

const {
  Value,
  View,
  ScrollView,
  interpolate,
  sub,
  diffClamp,
  Extrapolate,
} = Animated;

const ScreenWrapper = ({
  children,
  noScroll = false,
  statusBarColor,
  header,
  renderHeader,
  renderFooter,
  style = {},
}) => {
  const theme = useTheme();
  const scrollY = useRef(new Value(0)).current;
  const scrollDiffY = diffClamp(scrollY, 0, HEADER_HEIGHT);
  const headerFloatingState = sub(scrollY, scrollDiffY);

  const elevation = interpolate(headerFloatingState, {
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, 4],
    extrapolate: Extrapolate.CLAMP,
  });

  const translateY = interpolate(scrollDiffY, {
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT],
  });

  return (
    <SafeAreaView style={StyleSheet.absoluteFill}>
      <StatusBar
        backgroundColor={statusBarColor || theme.colors.background}
        animated={true}
        barStyle="dark-content"
      />
      {!!header && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 4,
          }}>
          <Appbar.Header
            animated={true}
            style={{
              elevation,
              transform: [{ translateY }],
            }}>
            <Appbar.Content title={header.title} />
            {header.actions.map((props) => (
              <Appbar.Action {...props} />
            ))}
          </Appbar.Header>
        </View>
      )}
      {renderHeader && renderHeader()}
      {!noScroll ? (
        <ScrollView
          overScrollMode="never"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flexGrow: 1,
            backgroundColor: theme.colors.background,
            ...style,
            ...(!!header && {
              paddingTop: style
                ? style.paddingTop
                  ? style.paddingTop + HEADER_HEIGHT
                  : style.paddingVertical
                  ? style.paddingVertical + HEADER_HEIGHT
                  : style.padding
                  ? style.padding + HEADER_HEIGHT
                  : HEADER_HEIGHT
                : HEADER_HEIGHT,
            }),
          }}
          onScroll={Animated.event([
            {
              nativeEvent: {
                contentOffset: {
                  y: scrollY,
                },
              },
            },
          ])}>
          {children}
        </ScrollView>
      ) : (
        <View
          style={{
            backgroundColor: theme.colors.background,
            flexGrow: 1,
            ...style,
          }}>
          {children}
        </View>
      )}
      {renderFooter && renderFooter()}
    </SafeAreaView>
  );
};

export default ScreenWrapper;
