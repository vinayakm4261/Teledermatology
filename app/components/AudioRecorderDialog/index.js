import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { FAB, useTheme } from 'react-native-paper';

import BottomModal from '../BottomModal';
import Button from '../Button';
import Subheading from '../Typography/Subheading';
import Caption from '../Typography/Caption';
import formStyles from '../../forms/styles';
import useAudioRecorder from '../../hooks/useAudioRecorder';
import useAudioPlayer from '../../hooks/useAudioPlayer';

const stages = {
  READY: 0,
  RECORDING: 1,
  PREVIEW: 2,
};

const AudioRecorderDialog = ({
  visible = true,
  onDismiss,
  onRecorded,
  onError,
}) => {
  const theme = useTheme();
  const [filepath, setFilepath] = useState(null);
  const [stage, setStage] = useState(stages.READY);

  const recorder = useAudioRecorder({
    onError,
    onRecorded: (path) => {
      setFilepath(path);
      setStage(stages.PREVIEW);
    },
    onRecordingStart: () => {
      setStage(stages.RECORDING);
    },
  });
  const player = useAudioPlayer(filepath, { onError });

  const handleDismiss = useCallback(() => {
    if (stage === stages.RECORDING) recorder.endRecording();
    setStage(stages.READY);
    onDismiss();
  }, [stage, recorder, onDismiss]);

  return (
    <BottomModal {...{ visible, onDismiss: handleDismiss }}>
      <Subheading style={{ alignSelf: 'center' }}>Record Audio</Subheading>
      {stage === stages.RECORDING ? (
        <>
          <Caption small style={{ alignSelf: 'center', marginBottom: 12 }}>
            Recording... {recorder.currentTime}
          </Caption>
          <View style={styles.buttonsGroup}>
            <View style={styles.buttonContainer}>
              <FAB
                icon="stop"
                style={styles.button}
                onPress={recorder.endRecording}
                theme={{ colors: { accent: 'red' } }}
                color="white"
              />
              <Caption small style={{ ...styles.bottonLabel, color: 'red' }}>
                STOP RECORDING
              </Caption>
            </View>
          </View>
        </>
      ) : stage === stages.PREVIEW ? (
        <>
          <Caption small style={{ alignSelf: 'center', marginBottom: 12 }}>
            {player?.isPlaying
              ? `Playing... ${player?.currentTime ? player.currentTime : ''}`
              : 'Press play button to preview recording.'}
          </Caption>
          <View style={styles.buttonsGroup}>
            <View style={styles.buttonContainer}>
              <FAB
                icon={player?.isPlaying ? 'stop' : 'play'}
                style={styles.button}
                onPress={recorder.endRecording}
                color="white"
              />
              <Caption
                small
                style={{ ...styles.bottonLabel, color: theme.colors.accent }}>
                {player?.isPlaying ? 'STOP PLAYING' : 'PLAY RECORDING'}
              </Caption>
            </View>
          </View>
          <View style={formStyles.inputRow}>
            <Button
              compact
              style={formStyles.inputRowLeft}
              onPress={() => {
                player.stop();
                setStage(stages.READY);
              }}
              mode="outlined">
              Retake
            </Button>
            <Button
              compact
              style={formStyles.inputRowRight}
              onPress={() => {
                onRecorded(filepath);
                handleDismiss();
              }}
              mode="contained">
              Done
            </Button>
          </View>
        </>
      ) : (
        <>
          <Caption style={{ alignSelf: 'center', marginBottom: 12 }} small>
            Press record button to start recording.
          </Caption>
          <View style={styles.buttonsGroup}>
            <View style={styles.buttonContainer}>
              <FAB
                icon="microphone"
                style={styles.button}
                onPress={recorder.startRecording}
                theme={{ colors: { accent: theme.colors.primary } }}
                color="white"
              />
              <Caption
                small
                style={{ ...styles.bottonLabel, color: theme.colors.primary }}>
                START RECORDING
              </Caption>
            </View>
          </View>
        </>
      )}
    </BottomModal>
  );
};

const styles = {
  buttonsGroup: {
    margin: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    margin: 8,
    alignItems: 'center',
    flexGrow: 1,
  },
  button: {
    elevation: 0,
  },
  bottonLabel: {
    margin: 0,
  },
};

export default AudioRecorderDialog;
