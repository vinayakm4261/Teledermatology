import { useState, useEffect } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';

const usePermission = (permission, title, message) => {
  const [permissionGranted, setPermissionGranted] = useState(
    Platform.OS !== 'android',
  );

  useEffect(() => {
    Platform.OS === 'android' &&
      PermissionsAndroid.request(permission, {
        title,
        message,
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      })
        .then((granted) => {
          setPermissionGranted(granted === PermissionsAndroid.RESULTS.GRANTED);
        })
        .catch((err) => {
          console.error(err);
          setPermissionGranted(false);
        });
  }, [permission, title, message]);

  return permissionGranted;
};

const useAudioPermission = () => {
  return usePermission(
    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    'Microphone Permission',
    'Teledermatolody needs access to your microphone.',
  );
};

export { useAudioPermission };
export default usePermission;
