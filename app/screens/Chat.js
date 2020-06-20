import React, { useCallback, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { TextInput, useTheme, FAB, IconButton } from 'react-native-paper';
import { connect } from 'react-redux';

import { ScreenWrapper, Title } from '../components';
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
    <ScreenWrapper scrolling={false}>
      <View style={{ alignItems: 'center', flexDirection: 'row', height: 56 }}>
        <IconButton
          icon="arrow-left"
          color={theme.colors.accent}
          onPress={handleExitChat}>
          Close
        </IconButton>
        <Title>Chats</Title>
      </View>
      <FlatList
        inverted={true}
        data={Object.entries(messages).sort(
          (a, b) => b[1].timeStamp - a[1].timeStamp,
        )}
        keyExtractor={([id, _]) => id}
        renderItem={({ item: [id, msg] }) => {
          return msg.author === userID ? (
            <View style={styles.senderContainer} key={id}>
              <Text style={styles.chatText}>{msg.content}</Text>
            </View>
          ) : (
            <View style={styles.receiverContainer} key={id}>
              <Text style={styles.chatText}>{msg.content}</Text>
            </View>
          );
        }}
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 12,
          paddingVertical: 4,
        }}
      />
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
