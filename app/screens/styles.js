import { StyleSheet } from 'react-native';

const loadingStyles = () => () =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

const loginStyles = ({ width }) => () =>
  StyleSheet.create({
    container: {
      justifyContent: 'space-between',
      flexGrow: 1,
      padding: 16,
      paddingTop: 8,
    },
    illustrationContainer: {
      paddingVertical: 12,
    },
    illustration: {
      width: width - 32,
    },
  });

const registerStyles = () => () =>
  StyleSheet.create({
    container: {
      justifyContent: 'space-between',
      flexGrow: 1,
      padding: 16,
      paddingTop: 8,
    },
  });

export { loadingStyles, loginStyles, registerStyles };
