import React, { useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import { connect } from 'react-redux';
import { GiftedChat } from 'react-native-gifted-chat';

import { Title } from '../components';
import { sendMessageAction, exitChatAction } from '../actions/chatActions';

const ChatScreen = ({
  navigation,
  sendMessage,
  exitChat,
  userID,
  messages,
}) => {
  const [message, setMessage] = useState('');
  const [, setSending] = useState(false);

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
    <>
      <View style={{ alignItems: 'center', flexDirection: 'row', height: 56 }}>
        <IconButton icon="arrow-left" onPress={handleExitChat}>
          Close
        </IconButton>
        <Title>Chats</Title>
      </View>
      <GiftedChat
        messages={Object.values(messages).sort(
          (a, b) => b.createdAt - a.createdAt,
        )}
        onSend={() => {
          handleSendMessage(message);
        }}
        onInputTextChanged={(text) => {
          setMessage(text);
        }}
        user={{ _id: userID }}
      />
    </>
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
