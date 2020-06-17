import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
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
      <View style={{ flex: 1, justifyContent: 'flex-end', margin: 16 }}>
        <View style={{ flex: 1, alignSelf: 'flex-start' }}>
          <Title>Chats</Title>
        </View>
        <View style={{ marginVertical: 16 }}>
          <TextInput placeholder="Enter message" />
        </View>
        <Button mode="contained" onPress={handleSignOut}>
          Send
        </Button>
      </View>
    </ScreenWrapper>
  );
};

const mapStateToProps = (state) => ({
  auth: state.authReducer.auth,
});

export default connect(mapStateToProps)(ChatScreen);
