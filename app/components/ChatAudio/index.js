import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import {
  FAB,
  IconButton,
  ProgressBar,
  Text,
  useTheme,
} from 'react-native-paper';

import useScreenDimensions from '../../hooks/useScreenDimensions';
import {
  AUDIO_STATUS,
  startPlayer,
  pausePlayer,
  stopPlayer,
} from '../../helpers/audioManager';

export default function ({ currentMessage, audioProps }) {
  const theme = useTheme();
  const { width } = useScreenDimensions();
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [playTime, setPlayTime] = useState('00:00:00');
  const [progress, setProgress] = useState(0);

  const handleAudio = useCallback(async () => {
    await startPlayer(currentMessage.audio, (playbackInfo) => {
      switch (playbackInfo.status) {
        case AUDIO_STATUS.begin: {
          setPlaying(true);
          break;
        }
        case AUDIO_STATUS.play: {
          const { current_position, duration, timeString } = playbackInfo.data;
          setProgress(current_position / duration);
          setPlayTime(timeString);
          break;
        }
        case AUDIO_STATUS.pause: {
          setPaused(true);
          break;
        }
        case AUDIO_STATUS.resume: {
          setPaused(false);
          break;
        }
        case AUDIO_STATUS.stop: {
          setProgress(0);
          setPaused(false);
          setPlaying(false);
          setPlayTime('00:00:00');
          break;
        }
      }
    });
  }, [currentMessage.audio]);

  const handlePause = useCallback(async () => {
    await pausePlayer();
    setPaused(true);
  }, []);

  const handleStop = useCallback(async () => {
    await stopPlayer();
    setProgress(0);
    setPaused(false);
    setPlaying(false);
    setPlayTime('00:00:00');
  }, []);

  useEffect(() => {
    return handleStop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={[{ width: width / 2 }, audioProps.containerStyle]}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 12,
        }}>
        <FAB
          color="#FFFFFF"
          icon={playing ? (paused ? 'play' : 'pause') : 'play'}
          style={{
            backgroundColor: theme.colors.primary,
            elevation: 0,
          }}
          small
          onPress={playing ? (paused ? handleAudio : handlePause) : handleAudio}
        />
        <Text style={{ color: '#696969', marginLeft: 8, marginTop: 2 }}>
          {playTime}
        </Text>
        {playing && (
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <IconButton
              icon="stop"
              color={theme.colors.accent}
              size={20}
              onPress={handleStop}
            />
          </View>
        )}
      </View>
      <ProgressBar
        style={{ marginHorizontal: 12, marginBottom: 12, borderRadius: 10 }}
        progress={progress}
        color="#696969"
        visible
      />
    </View>
  );
}
