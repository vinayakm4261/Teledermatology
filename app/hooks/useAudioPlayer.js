import { useRef, useCallback, useEffect } from 'react';
import { Player } from '@react-native-community/audio-toolkit';

export const DEFAULT_PLAYER_OPTIONS = {
  autoDestroy: false,
};

export const errorCodes = {
  INVALID_PATH: 'invaidpath',
  PREPARE_FAIL: 'preparefail',
  START_FAIL: 'startfail',
  SEEK_FAIL: 'seekfail',
  END_FAIL: 'endfail',
  INTERNAL_ERROR: 'notfound',
};

const useAudioPlayer = (path, { onError } = {}) => {
  const player = useRef(null);

  useEffect(() => {
    return () => {
      player.current?.destroy();
    };
  }, []);

  const errorHandler = useCallback(
    (error) => {
      if (error) {
        if (onError) onError(error);
        player.current.destroy();
      }
    },
    [onError],
  );

  const play = useCallback(() => {
    player.current = new Player(path, DEFAULT_PLAYER_OPTIONS).play(
      errorHandler,
    );
  }, [errorHandler, path]);

  const stop = useCallback(() => {
    player.current?.stop(errorHandler);
  }, [errorHandler]);

  return {
    ...player.current,
    play,
    stop,
  };
};

export default useAudioPlayer;
