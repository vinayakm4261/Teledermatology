import React, { useMemo, useCallback, useState } from 'react';
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
      setStage('PREVIEW');
    },
    onRecordingStart: () => {
      setStage('RECORDING');
    },
  });
  const player = useAudioPlayer(filepath, { onError });

  const renderModalContent = () => {
    if (stage === 'RECORDING')
      return (
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
      );

    if (stage === 'PREVIEW') {
      return (
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
                setStage('READY');
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
                onDismiss();
              }}
              mode="contained">
              Done
            </Button>
          </View>
        </>
      );
    }

    return (
      <>
        <Subheading style={{ marginBottom: 12 }}>Audio</Subheading>
        <View style={formStyles.inputRow}>
          <Button
            compact
            style={formStyles.inputRowLeft}
            icon="close"
            onPress={onDismiss}
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
    );
  };

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
        onBackdropPress={onDismiss}
        onBackButtonPress={onDismiss}
        onModalHide={onDismiss}
        onSwipeComplete={onDismiss}>
        <View
          style={{
            margin: 8,
            padding: 12,
            backgroundColor: 'white',
            zIndex: 100,
            borderRadius: theme.roundness * 2,
          }}>
          {renderModalContent()}
        </View>
      </Modal>
    </Portal>
  );
};

export default AudioRecorderDialog;
