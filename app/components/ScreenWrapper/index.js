import React from 'react';
import { View, StatusBar, SafeAreaView, ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';

const ScreenWrapper = ({ children }) => {
  const theme = useTheme();

  return (
    <SafeAreaView style={{ flexGrow: 1 }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flexGrow: 1,
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
          }}>
          {children}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ScreenWrapper;
