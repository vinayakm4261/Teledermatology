import React from 'react';
import { View, StatusBar, SafeAreaView, ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';

const ScreenWrapper = ({ children, scrolling = true }) => {
  const theme = useTheme();

  return (
    <SafeAreaView style={{ flexGrow: 1 }}>
      <StatusBar
        backgroundColor={theme.colors.background}
        animated={true}
        barStyle="dark-content"
      />
      {scrolling ? (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flexGrow: 1,
            backgroundColor: theme.colors.background,
          }}>
          {children}
        </ScrollView>
      ) : (
        <View
          style={{
            backgroundColor: theme.colors.background,
            flexGrow: 1,
          }}>
          {children}
        </View>
      )}
    </SafeAreaView>
  );
};

export default ScreenWrapper;
