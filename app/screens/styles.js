import { StyleSheet } from 'react-native';

const loginStyles = ({ width }) => () =>
  StyleSheet.create({
    container: {
      justifyContent: 'space-between',
      flexGrow: 1,
      padding: 8,
    },
    illustrationContainer: {
      paddingVertical: 12,
    },
    illustration: {
      width: width - 32,
    },
    inputGroup: {
      marginBottom: 16,
    },
  });

export { loginStyles };
