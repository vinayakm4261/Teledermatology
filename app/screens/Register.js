import React, { useEffect } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { Title, Button } from 'react-native-paper';
import auth from '@react-native-firebase/auth';

const styles = StyleSheet.create({});

const Register = (props) => {
  useEffect(() =>
    auth().onAuthStateChanged((user) => {
      if (!user) {
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
    <View
      style={{
        flex: 1,
        marginTop: 16,
        marginHorizontal: 16,
      }}>
      <StatusBar animated backgroundColor="#FFFFFF" barStyle="dark-content" />
      <Title>Register</Title>
      <Button mode="contained" onPress={handleSignOut}>
        Sign Out
      </Button>
    </View>
  );
};

export default Register;
