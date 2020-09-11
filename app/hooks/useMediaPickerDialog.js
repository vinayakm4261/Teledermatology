import React, { useState, useCallback } from 'react';

import MediaPickerDialog from '../components/MediaPickerDialog';

const useMediaPickerDialog = ({ onError, onPicked } = {}) => {
  const [dialogVisible, setDialogVisible] = useState(false);

  const showDialog = useCallback(() => {
    setDialogVisible(true);
  }, []);

  const handleDialogDismiss = useCallback(() => {
    setDialogVisible(false);
  }, []);

  const renderDialog = useCallback(
    () => (
      <MediaPickerDialog
        {...{
          visible: dialogVisible,
          onDismiss: handleDialogDismiss,
          onPicked,
          onError,
        }}
      />
    ),
    [dialogVisible, handleDialogDismiss, onPicked, onError],
  );

  return {
    Dialog: renderDialog,
    showDialog,
  };
};

export default useMediaPickerDialog;
