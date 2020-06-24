import React, { useState, useCallback, useEffect } from 'react';
import { Snackbar } from 'react-native-paper';

const useSnackbar = (props) => {
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarContent, setSnackbarContent] = useState(null);

  const handleSnackbarDismiss = useCallback(() => {
    setSnackbarVisible(false);
    setSnackbarContent(null);
  }, []);

  useEffect(() => {
    snackbarContent && setSnackbarVisible(true);
  }, [snackbarContent]);

  const renderSnackbar = useCallback(
    (overrideProps) => (
      <Snackbar
        duration={3000}
        {...props}
        {...overrideProps}
        visible={snackbarVisible}
        onDismiss={handleSnackbarDismiss}>
        {snackbarContent}
      </Snackbar>
    ),
    [props, snackbarVisible, handleSnackbarDismiss, snackbarContent],
  );

  return {
    Snackbar: renderSnackbar,
    showSnackbar: setSnackbarContent,
  };
};

export default useSnackbar;
