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

const profileStyles = () => () =>
  StyleSheet.create({
    subheading: {
      marginTop: 8,
    },
    listspace: {
      marginTop: 16,
    },
    icons: {
      alignItems: 'center',
    },
    hospitalNameSize: {
      fontSize: 20,
    },
    addressColor: {
      color: '#696969',
    },
    modalContainer: {
      alignItems: 'center',
    },
    image: {
      flexDirection: 'row',
    },
    trustSize: {
      height: 50,
      width: 70,
      margin: 16,
    },
    hospitalSize: {
      height: 50,
      width: 50,
      marginVertical: 16,
    },
  });

export { loadingStyles, loginStyles, registerStyles, profileStyles };
