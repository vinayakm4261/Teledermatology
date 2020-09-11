import React, { useState, useCallback } from 'react';

import AudioRecorderDialog from '../components/AudioRecorderDialog';

const useAudioRecorderDialog = ({ onError, onRecorded } = {}) => {
  const [dialogVisible, setDialogVisible] = useState(false);

  const showDialog = useCallback(() => {
    setDialogVisible(true);
  }, []);

  const handleDialogDismiss = useCallback(() => {
    setDialogVisible(false);
  }, []);

  const renderDialog = useCallback(
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
    Dialog: renderDialog,
    showDialog,
  };
};

export default useAudioRecorderDialog;
