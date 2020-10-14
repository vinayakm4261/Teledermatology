import React, { useState, useCallback, useMemo } from 'react';

const usePickerDialog = ({ Picker, onError, onPicked } = {}) => {
  const [dialogVisible, setDialogVisible] = useState(false);

  const showDialog = useCallback(() => {
    setDialogVisible(true);
  }, []);

  const handleDialogDismiss = useCallback(() => {
    setDialogVisible(false);
  }, []);

  const dialog = useMemo(
    () => (
      <Picker
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

export default usePickerDialog;
