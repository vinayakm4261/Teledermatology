import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputRowLeft: {
    flex: 1,
    marginRight: 4,
  },
  inputRowRight: {
    flex: 1,
    marginLeft: 4,
  },
  inputGroup: {
    marginBottom: 16,
  },
  fab: {
    position: 'absolute',
    margin: 60,
    left: 0,
    bottom: -70,
    backgroundColor: '#6C63FF',
  },
  submit: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#6C63FF',
  },
});
