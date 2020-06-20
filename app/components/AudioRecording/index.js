import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { IconButton } from 'react-native-paper';

export default function AudioRecorder() {
  const [isRecording, setisRecording] = useState(false);

  return (
    <View>
      {isRecording ? (
        <IconButton
          style={styles.btn}
          icon="square"
          color="red"
          size={28}
          onPress={() => {
            console.log('audio recording stop');
            setisRecording(false);
          }}
        />
      ) : (
        <IconButton
          style={styles.btn}
          icon="microphone"
          color="white"
          size={28}
          onPress={() => {
            console.log('audio recording');
            setisRecording(true);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: '#6C63FF',
    borderWidth: 3,
    borderColor: 'white',
    borderRadius: 30,
  },
});
