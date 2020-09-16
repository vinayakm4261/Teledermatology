import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import {
  Text,
  useTheme,
  ProgressBar,
  IconButton,
  Portal,
} from 'react-native-paper';
import Modal from 'react-native-modal';

import Button from '../Button';
import Subheading from '../Typography/Subheading';
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
  const [stage, setStage] = useState('READY');

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
    <Portal>
      <Modal
        useNativeDriver
        hideModalContentWhileAnimating
        backdropOpacity={0.25}
        style={{
          justifyContent: 'flex-end',
          padding: 0,
          margin: 0,
        }}
        isVisible={visible}
        swipeDirection={['down']}
        onBackdropPress={handleDismiss}
        onBackButtonPress={handleDismiss}
        onModalHide={handleDismiss}
        onSwipeComplete={handleDismiss}>
        <View
          style={{
            margin: 8,
            padding: 12,
            backgroundColor: 'white',
            zIndex: 100,
            borderRadius: theme.roundness * 2,
          }}>
          {stage === stages.RECORDING ? (
            <>
              <Subheading style={{ marginBottom: 12 }}>Recording</Subheading>
              <View style={formStyles.inputRow}>
                <Text style={formStyles.inputRowLeft}>Recording</Text>
                <Button
                  compact
                  style={formStyles.inputRowRight}
                  theme={{ colors: { primary: '#c4001d' } }}
                  icon="stop"
                  onPress={recorder.endRecording}
                  mode="contained">
                  Stop
                </Button>
              </View>
            </>
          ) : stage === stages.PREVIEW ? (
            <>
              <Subheading style={{ marginBottom: 12 }}>Preview</Subheading>
              <View style={formStyles.inputGroup}>
                <ProgressBar progress={player.currentTime / player.duration} />
                <IconButton
                  icon={player?.isPlaying ? 'stop' : 'play'}
                  onPress={() => {
                    if (player?.isPlaying) player.stop();
                    else player.play();
                  }}
                />
              </View>
              <View style={formStyles.inputRow}>
                <Button
                  compact
                  style={formStyles.inputRowLeft}
                  icon="restart"
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
                  icon="check"
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
              <Subheading style={{ marginBottom: 12 }}>Audio</Subheading>
              <View style={formStyles.inputRow}>
                <Button
                  compact
                  style={formStyles.inputRowLeft}
                  icon="close"
                  onPress={handleDismiss}
                  mode="outlined">
                  Cancel
                </Button>
                <Button
                  compact
                  style={formStyles.inputRowRight}
                  icon="microphone"
                  onPress={recorder.startRecording}
                  mode="contained">
                  Record
                </Button>
              </View>
            </>
          )}
        </View>
      </Modal>
    </Portal>
  );
};

export default AudioRecorderDialog;
