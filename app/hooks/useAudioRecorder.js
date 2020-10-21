import { useRef, useCallback } from 'react';
import { Recorder } from '@react-native-community/audio-toolkit';
import moment from 'moment';
import { useAudioPermission } from './usePermission';

export const DEFAULT_RECORDER_OPTIONS = {
  bitrate: 64000,
  channels: 1,
  format: 'aac',
  encoder: 'aac',
  quality: 'medium',
};

export const errorCodes = {
  INVALID_PATH: 'invaidpath',
  PREPARE_FAIL: 'preparefail',
  START_FAIL: 'startfail',
  END_FAIL: 'endfail',
  INTERNAL_ERROR: 'notfound',
  NO_PERMISSION: 'nopermission',
  NOT_SUPPORTED: 'notsupported',
};

const useAudioRecorder = ({ onError, onRecorded, onRecordingStart } = {}) => {
  const recorder = useRef(null);
  const audioPermission = useAudioPermission();

  const startRecording = useCallback(() => {
    if (audioPermission) {
      recorder.current = new Recorder(
        `${moment().format('YYYYMMDDHHmmss')}.${
          DEFAULT_RECORDER_OPTIONS.format
        }`,
        DEFAULT_RECORDER_OPTIONS,
      ).record((error) => {
        if (error) {
          if (onError) onError(error);
          recorder.current?.destroy();
        } else if (onRecordingStart) onRecordingStart();
      });
    } else if (onError) onError(errorCodes.NO_PERMISSION);
  }, [audioPermission, onError, onRecordingStart]);

  const endRecording = useCallback(() => {
    recorder.current.stop((error) => {
      if (error) onError && onError(error);
      else onRecorded && onRecorded(recorder.current?.fsPath);
      recorder.current?.destroy();
    });
  }, [onError, onRecorded]);

  return {
    ...recorder.current,
    startRecording,
    endRecording,
  };
};

export default useAudioRecorder;
