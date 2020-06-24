import React, { useEffect } from 'react';
import { StatusBar, SafeAreaView } from 'react-native';
import { Title, Button, IconButton } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import AudioRecorder from '../components/AudioRecording';

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
      <AudioRecorder />
    </SafeAreaView>
  );
};

export default HomeScreen;
