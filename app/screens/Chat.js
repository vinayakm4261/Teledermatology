import React, { useEffect, useCallback, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextInput, useTheme, FAB, IconButton } from 'react-native-paper';
import { connect } from 'react-redux';

import { ScreenWrapper, Button, Title } from '../components';
import { sendMessageAction, exitChatAction } from '../actions/chatActions';

const styles = StyleSheet.create({
  senderContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#DEDEDE',
    height: 40,
    maxWidth: 238,
    flexWrap: 'wrap',
    padding: 10,
    borderRadius: 8,
  },
  receiverContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5E3FF',
    height: 40,
    maxWidth: 238,
    flexWrap: 'wrap',
    padding: 10,
    borderRadius: 8,
  },
  inputContainer: {
    height: 52,
    elevation: 5,
    flexDirection: 'row',
    marginTop: 16,
    alignItems: 'center',
  },
  sendButton: {
    backgroundColor: '#6C63FF',
    elevation: 0,
  },
});

const ChatScreen = ({
  navigation,
  sendMessage,
  exitChat,
  userID,
  messages,
}) => {
  const theme = useTheme();

  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSendMessage = useCallback(() => {
    setSending(true);
    sendMessage(message)
      .catch((err) => console.log(err))
      .finally(() => {
        setMessage('');
        setSending(false);
      });
  }, [sendMessage, message]);

  const handleExitChat = useCallback(() => {
    exitChat();
    navigation.goBack(null);
  }, [exitChat, navigation]);

  return (
    <ScreenWrapper>
      <View style={{ alignItems: 'center', flexDirection: 'row', height: 56 }}>
        <IconButton
          icon="arrow-left"
          color={theme.colors.accent}
          onPress={handleExitChat}>
          Close
        </IconButton>
        <Title>Chats</Title>
      </View>
      <View style={{ flex: 1, justifyContent: 'flex-end', margin: 16 }}>
        {messages ? (
          <View>
            {Object.keys(messages).map((msg) => {
              if (messages[msg].author === userID) {
                return (
                  <View style={styles.senderContainer}>
                    <Text>{messages[msg].content}</Text>
                  </View>
                );
              } else {
                return (
                  <View style={styles.receiverContainer}>
                    <Text>{messages[msg].content}</Text>
                  </View>
                );
              }
            })}
          </View>
        ) : null}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Enter message"
            style={{ flex: 1, marginRight: 16, height: 52 }}
            value={message}
            dense
            onChangeText={setMessage}
          />
          <FAB
            onPress={handleSendMessage}
            disabled={!!sending}
            loading={sending}
            icon="send"
            small
            dark
            style={styles.sendButton}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

const mapStateToProps = (state) => ({
  userID: state.authReducer.userData._id,
  messages: state.chatReducer.chats,
});

const mapDispatchToProps = (dispatch) => ({
  sendMessage: (message) => dispatch(sendMessageAction(message)),
  exitChat: () => dispatch(exitChatAction()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen);
