import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import {
  ActivityIndicator,
  FAB,
  IconButton,
  useTheme,
  Text,
} from 'react-native-paper';
import { connect } from 'react-redux';
import {
  GiftedChat,
  Bubble,
  InputToolbar,
  Time,
} from 'react-native-gifted-chat';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { ChatAudio, ChatVideo, ScreenWrapper } from '../components';
import BottomModal from '../components/BottomModal';

import useMediaPickerDialog from '../hooks/useMediaPickerDialog';
import useSnackbar from '../hooks/useSnackbar';
import { sendMessageAction, exitChatAction } from '../actions/chatActions';

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
  const [mediaSending, setMediaSending] = useState(false);
  const { showSnackbar, Snackbar } = useSnackbar();

  const onError = useCallback(() => {
    showSnackbar('An error occurred.');
  }, [showSnackbar]);

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
    if (message.length > 0) {
      setSending(true);
      setMessage('');
      sendMessage({ text: message })
        .catch(({ type }) => {
          showSnackbar(type);
        })
        .finally(() => {
          setSending(false);
        });
    }
  }, [message, sendMessage, showSnackbar]);

  const handleMediaSend = useCallback(
    (media) => {
      setMediaSending(true);
      sendMessage({ media })
        .catch(({ type }) => {
          showSnackbar(type);
        })
        .finally(() => {
          setMediaSending(false);
        });
    },
    [sendMessage, showSnackbar],
  );

  const mediaPicker = useMediaPickerDialog({
    onError,
    onPicked: handleMediaSend,
  });

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
          onPress={mediaPicker.showDialog}
        />
      </View>
    );
  }, [mediaPicker.showDialog]);

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

  const renderMessageVideo = useCallback((messageVideoProps) => {
    return <ChatVideo {...messageVideoProps} />;
  }, []);

  const renderMessageAudio = useCallback((messageVideoProps) => {
    return <ChatAudio {...messageVideoProps} />;
  }, []);

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
          color="#FFFFFF"
          onPress={onSend}
          disabled={sending}
        />
      );
    },
    [sending, theme.colors.primary],
  );

  return (
    <>
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
          renderMessageVideo={renderMessageVideo}
          renderMessageAudio={renderMessageAudio}
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
            bottom: 12,
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
          imageStyle={{ borderRadius: 10 }}
          lightboxProps={{ underlayColor: '#F1F1F1' }}
          alwaysShowSend
          scrollToBottom
          minInputToolbarHeight={56}
        />
      </ScreenWrapper>
      <Snackbar />
      {mediaPicker.dialog}
      <BottomModal visible={mediaSending}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{ marginRight: 8 }}>Uploading selected media..</Text>
          <ActivityIndicator />
        </View>
      </BottomModal>
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
