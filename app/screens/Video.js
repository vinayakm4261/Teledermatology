import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import RtcEngine, {
  RtcLocalView,
  RtcRemoteView,
  VideoRenderMode,
} from 'react-native-agora';
import { FAB, IconButton } from 'react-native-paper';
import { connect } from 'react-redux';

import { Loader, ScreenWrapper } from '../components';

import useSnackbar from '../hooks/useSnackbar';
import APP_ID from '../config/agora';

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
  localVideoContainer: {
    position: 'absolute',
    zIndex: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  remote: {
    width: width / 3,
    height: 180,
    margin: 16,
    borderRadius: 10,
  },
});

const VideoScreen = ({ route, navigation, isDoctor }) => {
  const { channelName, token } = route.params;
  const [joinSucceed, setJoinSucceed] = useState(false);
  const [peerIds, setPeerIds] = useState([]);
  const [muted, setMuted] = useState(false);
  const { Snackbar, showSnackbar } = useSnackbar();
  const engine = useRef(RtcEngine);

  useEffect(() => {
    init();
  }, [init]);

  const init = useCallback(async () => {
    engine.current = await RtcEngine.create(APP_ID);
    await engine.current.enableVideo();

    engine.current.addListener('Warning', (warn) => {
      console.log('Warning', warn);
    });

    engine.current.addListener('Error', (err) => {
      console.log('Error', err);
      showSnackbar(err);
    });

    engine.current.addListener('UserJoined', (uID, elapsed) => {
      console.log('UserJoined', uID, elapsed);

      if (peerIds.indexOf(uID) === -1) {
        setPeerIds((prevIDs) => [...prevIDs, uID]);
      }
    });

    engine.current.addListener('UserOffline', (uID, reason) => {
      console.log('UserOffline', uID, reason);
      setPeerIds(peerIds.filter((id) => id !== uID));
    });

    engine.current.addListener(
      'JoinChannelSuccess',
      (channel, uID, elapsed) => {
        console.log('JoinChannelSuccess', channel, uID, elapsed);

        setJoinSucceed(true);
      },
    );

    await engine.current.joinChannel(
      token,
      channelName,
      null,
      isDoctor ? 1 : 0,
    );
  }, [peerIds, isDoctor, channelName, token, showSnackbar]);

  const endCall = useCallback(async () => {
    await engine.current.leaveChannel();
    await engine.current.destroy();
    setPeerIds([]);
    setJoinSucceed(false);
    navigation.goBack(null);
  }, [setPeerIds, setJoinSucceed, navigation]);

  const muteAudio = useCallback(async () => {
    await engine.current.muteLocalAudioStream(!muted);
    setMuted(!muted);
  }, [muted]);

  const flipCamera = useCallback(async () => {
    await engine.current.switchCamera();
  }, []);

  const renderFooter = useCallback(
    () => (
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          margin: 16,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
        }}>
        <IconButton
          icon={muted ? 'microphone' : 'microphone-off'}
          color="#FFFFFF"
          onPress={muteAudio}
        />
        <FAB
          style={{ marginHorizontal: 16 }}
          icon="phone-hangup"
          onPress={endCall}
          theme={{ colors: { accent: '#bd0f32' } }}
        />
        <IconButton icon="camera-switch" color="#FFFFFF" onPress={flipCamera} />
        <IconButton
          style={{ marginRight: -38, zIndex: 10 }}
          icon="dots-vertical"
          color="#FFFFFF"
          onPress={() => console.log('More')}
        />
      </View>
    ),
    [endCall, muted, muteAudio, flipCamera],
  );

  return (
    <ScreenWrapper noScroll renderFooter={renderFooter}>
      <Loader loaded={joinSucceed}>
        {() => (
          <View style={{ flex: 1 }}>
            <View style={styles.localVideoContainer}>
              <RtcLocalView.SurfaceView
                style={styles.remote}
                channelId={channelName}
                renderMode={VideoRenderMode.Hidden}
                zOrderMediaOverlay={true}
              />
            </View>
            {peerIds.map((value) => {
              return (
                <RtcRemoteView.SurfaceView
                  style={{ width, height }}
                  uid={value}
                  channelId={channelName}
                  renderMode={VideoRenderMode.Hidden}
                  zOrderMediaOverlay={false}
                />
              );
            })}
          </View>
        )}
      </Loader>
      <Snackbar />
    </ScreenWrapper>
  );
};

const mapStateToProps = (state) => ({
  isDoctor: state.authReducer.isDoctor,
});

export default connect(mapStateToProps)(VideoScreen);
