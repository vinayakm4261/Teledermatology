import React from 'react';
import { View } from 'react-native';
import { useTheme, Portal } from 'react-native-paper';
import Modal from 'react-native-modal';

export default ({ visible, onDismiss, children }) => {
  const theme = useTheme();
  return (
    <Portal>
      <Modal
        useNativeDriver
        hideModalContentWhileAnimating
        backdropOpacity={0.25}
        style={{
          justifyContent: 'flex-end',
          padding: 0,
          margin: 0,
        }}
        isVisible={visible}
        onBackdropPress={onDismiss}
        onBackButtonPress={onDismiss}
        onModalHide={onDismiss}>
        <View
          style={{
            margin: 8,
            padding: 12,
            backgroundColor: 'white',
            zIndex: 100,
            borderRadius: theme.roundness * 2,
          }}>
          {children}
        </View>
      </Modal>
    </Portal>
  );
};
