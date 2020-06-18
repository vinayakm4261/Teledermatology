import React, { useEffect, useCallback, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextInput, useTheme, FAB, IconButton } from 'react-native-paper';
import { connect } from 'react-redux';

import { ScreenWrapper, Button, Title } from '../components';
import { sendMessageAction, exitChatAction } from '../actions/chatActions';

const styles = StyleSheet.create({
  senderContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#EDEDED',
    minHeight: 40,
    maxWidth: 238,
    padding: 10,
    borderRadius: 8,
    marginVertical: 2,
    flexShrink: 1,
  },
  receiverContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5E3FF',
    minHeight: 40,
    maxWidth: 238,
    padding: 10,
    borderRadius: 8,
    marginVertical: 2,
    flexShrink: 1,
  },
  chatText: {
    fontFamily: 'NotoSans-Regular',
    fontSize: 14,
    flexShrink: 1,
  },
  inputContainer: {
    height: 52,
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
            {Object.entries(messages)
              .sort((a, b) => a[1].timeStamp - b[1].timeStamp)
              .map((msg) => {
                if (msg[1].author === userID) {
                  return (
                    <View style={styles.senderContainer} key={msg[0]}>
                      <Text style={styles.chatText}>{msg[1].content}</Text>
                    </View>
                  );
                } else {
                  return (
                    <View style={styles.receiverContainer} key={msg[0]}>
                      <Text style={styles.chatText}>{msg[1].content}</Text>
                    </View>
                  );
                }
              })}
          </View>
        ) : null}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Message"
            style={{ flex: 1, marginRight: 16, height: 52 }}
            value={message}
            dense
            onChangeText={setMessage}
          />
          <FAB
            onPress={handleSendMessage}
            disabled={!!sending || !message}
            loading={sending}
            icon="send"
            small
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
