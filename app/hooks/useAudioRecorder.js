import { useRef, useState, useCallback } from 'react';
import { Player, Recorder } from '@react-native-community/audio-toolkit';
import { useAudioPermission } from './usePermission';

const useAudioRecorder = (filename) => {
  const recorder = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const audioPermission = useAudioPermission();

  const startRecording = useCallback(() => {
    if (audioPermission) {
      recorder.current = new Recorder(filename).record((err) => {
        console.log('recording');
        console.log(recorder.current);
        console.log(err);
        setIsRecording(true);
      });
    } else console.log('no permission');
  }, [audioPermission, filename]);

  const endRecording = useCallback(() => {
    console.log('stopping');
    console.log(recorder.current);
    recorder.current.stop((err) => {
      setIsRecording(false);
      if (err) console.log(err);
      else {
        recorder.current = null;
        new Player(filename)
          .play(() => {
            console.log('playing');
          })
          .on('ended', (playerr) => {
            console.log(playerr);
            console.log('played');
          });
      }
    });
  }, [filename]);

  return { startRecording, endRecording, isRecording };
};

export default useAudioRecorder;
