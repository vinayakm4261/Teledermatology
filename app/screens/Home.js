import React, { useEffect } from 'react';
import { View, StyleSheet, StatusBar, SafeAreaView } from 'react-native';
import { Title, Button } from 'react-native-paper';
import auth from '@react-native-firebase/auth';

const styles = StyleSheet.create({});

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
    </SafeAreaView>
  );
};

export default HomeScreen;
