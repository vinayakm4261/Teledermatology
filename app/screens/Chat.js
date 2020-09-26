import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { FAB, IconButton, useTheme } from 'react-native-paper';
import { connect } from 'react-redux';
import {
  GiftedChat,
  Bubble,
  InputToolbar,
  Time,
} from 'react-native-gifted-chat';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { ScreenWrapper } from '../components';
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
  const theme = useTheme();

  const header = useMemo(
    () => ({
      title: 'Chat',
      backAction: () => navigation.goBack(null),
    }),
    [navigation],
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      exitChat && exitChat();
    });

    return unsubscribe;
  }, [exitChat, navigation]);

  const handleSendMessage = useCallback(() => {
    setSending(true);
    sendMessage(message)
      .catch((err) => console.log(err))
      .finally(() => {
        setMessage('');
        setSending(false);
      });
  }, [sendMessage, message]);

  const renderMediaAction = useCallback(() => {
    return (
      <View
        style={{
          backgroundColor: '#FFFFFF',
          alignItems: 'center',
          flex: 1,
        }}>
        <IconButton
          size={24}
          icon="plus-circle"
          onPress={() => {
            alert('Hello!');
          }}
        />
      </View>
    );
  }, []);

  const renderInputToolbar = useCallback(
    ({ renderActions, ...toolBarProps }) => {
      return (
        <InputToolbar
          renderActions={() => <View>{renderActions()}</View>}
          containerStyle={{
            borderTopWidth: 0,
            elevation: 4,
            borderRadius: 8,
            paddingVertical: 4,
            backgroundColor: theme.colors.surface,
          }}
          primaryStyle={{
            borderRadius: 8,
            paddingRight: 12,
            alignItems: 'center',
          }}
          {...toolBarProps}
        />
      );
    },
    [theme.colors.surface],
  );

  const renderBubble = useCallback(
    (bubbleProps) => {
      return (
        <Bubble
          wrapperStyle={{
            left: { backgroundColor: '#E5E3FF', borderRadius: 10 },
            right: { backgroundColor: '#F1F1F1', borderRadius: 10 },
          }}
          textStyle={{
            right: {
              color: theme.colors.text,
              fontFamily: 'NotoSans-Regular',
            },
            left: {
              color: theme.colors.text,
              fontFamily: 'NotoSans-Regular',
            },
          }}
          {...bubbleProps}
        />
      );
    },
    [theme.colors.text],
  );

  const renderTime = useCallback(
    (timeProps) => {
      return (
        <Time
          {...timeProps}
          timeTextStyle={{
            left: {
              fontFamily: 'NotoSans-Regular',
              color: theme.colors.greyLight,
            },
            right: {
              fontFamily: 'NotoSans-Regular',
              color: theme.colors.greyLight,
            },
          }}
        />
      );
    },
    [theme.colors.greyLight],
  );

  const renderSend = useCallback(
    ({ onSend }) => {
      return (
        <FAB
          icon={({ size, color }) => (
            <MaterialIcons
              name="send"
              size={size}
              color={color}
              style={{
                marginTop: -10,
                marginLeft: -8,
              }}
            />
          )}
          style={{
            height: 36,
            width: 36,
            elevation: 0,
            backgroundColor: theme.colors.primary,
          }}
          onPress={onSend}
        />
      );
    },
    [theme.colors.primary],
  );

  return (
    <ScreenWrapper {...{ header }}>
      <GiftedChat
        messages={Object.values(messages).sort(
          (a, b) => b.createdAt - a.createdAt,
        )}
        text={message}
        onSend={() => {
          handleSendMessage(message);
        }}
        onInputTextChanged={(text) => {
          setMessage(text);
        }}
        user={{ _id: userID }}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        renderActions={renderMediaAction}
        renderSend={renderSend}
        renderTime={renderTime}
        scrollToBottomComponent={() => (
          <MaterialIcons name="expand-more" size={20} color="#FFFFFF" />
        )}
        scrollToBottomStyle={{
          height: 28,
          width: 28,
          right: 12,
          bottom: 16,
          backgroundColor: theme.colors.accent,
          opacity: 1,
          elevation: 1,
        }}
        textInputStyle={{
          fontFamily: 'NotoSans-Regular',
        }}
        textInputProps={{
          autoCapitalize: 'sentences',
        }}
        alwaysShowSend
        scrollToBottom
        minInputToolbarHeight={56}
      />
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
