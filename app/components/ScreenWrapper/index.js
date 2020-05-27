import React from 'react';
import { View, StatusBar, SafeAreaView, ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';
import useScreenDimensions from '../../hooks/useScreenDimensions';

const ScreenWrapper = ({ children }) => {
  const theme = useTheme();
  const { height } = useScreenDimensions();

  return (
    <SafeAreaView>
      <ScrollView
        contentContainerStyle={{
          height: height - StatusBar.currentHeight,
        }}>
        <StatusBar
          backgroundColor={theme.colors.background}
          animated={true}
          barStyle="dark-content"
        />
        <View
          style={{
            backgroundColor: theme.colors.background,
            flexGrow: 1,
            paddingTop: 0,
            paddingHorizontal: 8,
            paddingBottom: 8,
          }}>
          {children}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ScreenWrapper;
