import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, useTheme } from 'react-native-paper';
import { connect } from 'react-redux';

import { ScreenWrapper, Button, Title } from '../components';
import { setDatabaseAction, initChatAction } from '../actions/chatActions';

const styles = StyleSheet.create({});

const HomeScreen = ({ navigation, auth, setDatabase, initChat }) => {
  const theme = useTheme();
  const [chatID, setChatID] = useState('0d6de1984cd81bd295f4b3f9');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setDatabase('/chats').catch((err) => console.log(err));
  }, [setDatabase, initChat]);

  const handleChatIDChange = useCallback((value) => setChatID(value), [
    setChatID,
  ]);

  const handleInitChat = useCallback(() => {
    setSubmitting(true);
    initChat({
      appointmentID: chatID,
      receiverID: 'dA9WPHdt3QetWffUrRjFXnEfMUR2',
    })
      .then(() => navigation.navigate('Chat'))
      .catch((err) => console.log(err))
      .finally(() => setSubmitting(false));
  }, [initChat, chatID, navigation]);

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => navigation.navigate('Login'))
      .catch((err) => alert(err));
  };

  return (
    <ScreenWrapper>
      <View style={{ margin: 16 }}>
        <Title>HomeChat</Title>
        <View style={{ marginVertical: 16 }}>
          <TextInput
            style={{ height: 56 }}
            placeholder="Enter chat ID"
            value={chatID}
            onChangeText={handleChatIDChange}
          />
        </View>
        <Button
          style={{ marginBottom: 16 }}
          mode="contained"
          loading={submitting}
          onPress={handleInitChat}>
          Start Chat
        </Button>
        <Button
          style={{ marginBottom: 16 }}
          mode="contained"
          onPress={() => navigation.navigate('Chat')}>
          Next
        </Button>
        <Button
          mode="contained"
          dark
          color={theme.colors.accent}
          onPress={handleSignOut}>
          Sign Out
        </Button>
      </View>
    </ScreenWrapper>
  );
};

const mapStateToProps = (state) => ({
  auth: state.authReducer.auth,
});

const mapDispatchToProps = (dispatch) => ({
  setDatabase: (payload) => dispatch(setDatabaseAction(payload)),
  initChat: (payload) => dispatch(initChatAction(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
