import React, { useState, useCallback, useMemo } from 'react';

import AudioRecorderDialog from '../components/AudioRecorderDialog';

const useAudioRecorderDialog = ({ onError, onRecorded } = {}) => {
  const [dialogVisible, setDialogVisible] = useState(false);

  const showDialog = useCallback(() => {
    setDialogVisible(true);
  }, []);

  const handleDialogDismiss = useCallback(() => {
    setDialogVisible(false);
  }, []);

  const dialog = useMemo(
    () => (
      <AudioRecorderDialog
        {...{
          visible: dialogVisible,
          onDismiss: handleDialogDismiss,
          onRecorded,
          onError,
        }}
      />
    ),
    [dialogVisible, handleDialogDismiss, onRecorded, onError],
  );

  return {
    dialog,
    showDialog,
  };
};

export default useAudioRecorderDialog;
