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

const viewAppointmentStyles = () => () =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    rowLeft: {
      flex: 1,
      marginRight: 4,
    },
    rowRight: {
      flex: 1,
      marginLeft: 4,
    },
    card: {
      marginVertical: 4,
      backgroundColor: '#eeeeee',
      elevation: 0,
    },
    img: {
      height: 100,
      width: 100,
      margin: 4,
      borderRadius: 10,
    },
    mediaContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      padding: 6,
    },
  });

export { loadingStyles, loginStyles, registerStyles, viewAppointmentStyles };
