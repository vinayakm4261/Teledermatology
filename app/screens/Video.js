import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import RtcEngine, {
  RtcLocalView,
  RtcRemoteView,
  VideoRenderMode,
} from 'react-native-agora';
import { connect } from 'react-redux';

import requestCameraAndAudioPermission from '../components/VideoComponents/Permission';
import styles from '../components/VideoComponents/Style';
import APP_ID from '../config/agora';

const VideoScreen = ({ route, navigation, isDoctor }) => {
  const { channelName } = route.params;
  const [joinSucceed, setJoinSucceed] = useState(false);
  const [peerIds, setPeerIds] = useState([]);
  const engine = useRef(RtcEngine);

  if (Platform.OS === 'android') {
    requestCameraAndAudioPermission().then(() => {
      console.log('requested!');
    });
  }

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
  }, [peerIds]);

  const startCall = useCallback(async () => {
    await engine.current.joinChannel('', channelName, null, isDoctor ? 1 : 0);
  }, [channelName, isDoctor]);

  const endCall = useCallback(async () => {
    await engine.current.leaveChannel();
    setPeerIds([]);
    setJoinSucceed(false);
  }, [setPeerIds, setJoinSucceed]);

  const _renderVideos = useCallback(() => {
    return joinSucceed ? (
      <View style={styles.fullView}>
        <RtcLocalView.SurfaceView
          style={styles.max}
          channelId={channelName}
          renderMode={VideoRenderMode.Hidden}
        />
        {_renderRemoteVideos()}
      </View>
    ) : null;
  }, [_renderRemoteVideos, joinSucceed, channelName, peerIds]);

  const _renderRemoteVideos = useCallback(() => {
    return (
      <ScrollView
        style={styles.remoteContainer}
        contentContainerStyle={{ paddingHorizontal: 2.5 }}
        horizontal={true}>
        {peerIds.map((value, index, array) => {
          return (
            <RtcRemoteView.SurfaceView
              style={styles.remote}
              uid={value}
              channelId={channelName}
              renderMode={VideoRenderMode.Hidden}
              zOrderMediaOverlay={true}
            />
          );
        })}
      </ScrollView>
    );
  }, [peerIds, channelName]);

  return (
    <View style={styles.max}>
      <View style={styles.max}>
        <View style={styles.buttonHolder}>
          <TouchableOpacity onPress={startCall} style={styles.button}>
            <Text style={styles.buttonText}> Start Call </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={endCall} style={styles.button}>
            <Text style={styles.buttonText}> End Call </Text>
          </TouchableOpacity>
        </View>
        {_renderVideos()}
      </View>
    </View>
  );
};

const mapStateToProps = (state) => ({
  isDoctor: state.authReducer.isDoctor,
});

export default connect(mapStateToProps)(VideoScreen);
