import React, { useEffect } from 'react';
import { StatusBar, SafeAreaView } from 'react-native';
import { Title, Button, IconButton } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import useAudioRecorder from '../hooks/useAudioRecorder';

const HomeScreen = (props) => {
  useEffect(() =>
    auth().onAuthStateChanged((user) => {
      if (user) {
        // console.log('Logged In: ', user);
      } else {
        props.navigation.navigate('Login');
      }
    }),
  );

  const handleSignOut = () => {
    auth()
      .signOut()
      .then(() => props.navigation.navigate('Login'))
      .catch((err) => alert(err));
  };

  const { startRecording, endRecording, isRecording } = useAudioRecorder(
    'dummy.mp3',
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        marginTop: 16,
        marginHorizontal: 16,
      }}>
      <StatusBar animated backgroundColor="#FFFFFF" barStyle="dark-content" />
      <Title>This is Home</Title>
      <Button mode="contained" onPress={handleSignOut}>
        Sign Out
      </Button>
      <IconButton
        icon="camera"
        color="black"
        size={32}
        onPress={() => {
          props.navigation.navigate('Camera');
        }}
      />
      <IconButton
        icon={isRecording ? 'square' : 'microphone'}
        size={32}
        onPress={() => {
          isRecording ? endRecording() : startRecording();
        }}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
