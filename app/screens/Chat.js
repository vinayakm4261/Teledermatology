import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import { connect } from 'react-redux';

import { ScreenWrapper, Button, Title } from '../components';

const styles = StyleSheet.create({});

const ChatScreen = ({ navigation, auth }) => {
  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => navigation.navigate('Login'))
      .catch((err) => alert(err));
  };

  return (
    <ScreenWrapper>
      <Title>Chats</Title>
      <View style={{ marginVertical: 16 }}>
        <TextInput placeholder="Enter message" />
      </View>
      <Button mode="contained" onPress={handleSignOut}>
        Sign Out
      </Button>
    </ScreenWrapper>
  );
};

const mapStateToProps = (state) => ({
  auth: state.authReducer.auth,
});

export default connect(mapStateToProps)(ChatScreen);
