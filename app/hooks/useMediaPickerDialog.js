import React, { useState, useCallback, useMemo } from 'react';

import MediaPickerDialog from '../components/MediaPickerDialog';

const useMediaPickerDialog = ({ onError, onPicked } = {}) => {
  const [dialogVisible, setDialogVisible] = useState(false);

  const showDialog = useCallback(() => {
    setDialogVisible(true);
  }, []);

  const handleDialogDismiss = useCallback(() => {
    setDialogVisible(false);
  }, []);

  const dialog = useMemo(
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
    dialog,
    showDialog,
  };
};

export default useMediaPickerDialog;
