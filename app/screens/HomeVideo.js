import React, { useState, useCallback } from 'react';
import { View } from 'react-native';
import { TextInput, useTheme } from 'react-native-paper';
import { connect } from 'react-redux';

import { ScreenWrapper, Button, Title } from '../components';
import { initVideoCallAction } from '../actions/infoActions';

const HomeScreen = ({ navigation, auth, initVideoCall }) => {
  const theme = useTheme();
  const [channelName, setChannelName] = useState('channel-x');
  const [submitting, setSubmitting] = useState(false);

  const handleChannelName = useCallback((value) => setChannelName(value), [
    setChannelName,
  ]);

  const handleInitVideoCall = useCallback(() => {
    setSubmitting(true);
    initVideoCall(channelName)
      .then(({ token }) =>
        navigation.navigate('Video', {
          channelName,
          token,
        }),
      )
      .catch((err) => alert(JSON.stringify(err)))
      .finally(() => setSubmitting(false));
  }, [navigation, setSubmitting, channelName, initVideoCall]);

  const handleSignOut = useCallback(() => {
    auth
      .signOut()
      .then(() => navigation.navigate('Login'))
      .catch((err) => alert(err));
  }, [auth, navigation]);

  return (
    <ScreenWrapper>
      <View style={{ margin: 16 }}>
        <Title>AgoraCall</Title>
        <View style={{ marginVertical: 16 }}>
          <TextInput
            style={{ height: 56 }}
            placeholder="Enter channel name"
            value={channelName}
            onChangeText={handleChannelName}
          />
        </View>
        <Button
          style={{ marginBottom: 16 }}
          mode="contained"
          loading={submitting}
          onPress={handleInitVideoCall}>
          Start Call
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
  initVideoCall: (channelName) => dispatch(initVideoCallAction(channelName)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
