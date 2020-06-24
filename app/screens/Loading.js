import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { connect } from 'react-redux';

import auth from '@react-native-firebase/auth';

import { loadingStyles } from './styles';
import { ScreenWrapper } from '../components';

import useSnackbar from '../hooks/useSnackbar';
import initializeTranslations from '../locales/initialize';
import translate from '../locales/translate';

import {
  setAuthAction,
  setUserDataLoadedAction,
  loadUserDataAction,
} from '../actions/authActions';
import {
  setLanguageAction,
  setAppLoadedAction,
} from '../actions/localeActions';

const LoadingScreen = ({
  authLoaded,
  languageLoaded,
  userDataLoaded,
  loadUserData,
  setAuth,
  setLanguage,
  setUserDataLoaded,
  setAppLoaded,
}) => {
  const styles = useMemo(loadingStyles(), []);
  const { Snackbar, showSnackbar } = useSnackbar();
  const [retries, setRetries] = useState(0);

  useEffect(() => {
    setAuth(auth());
  }, [setAuth]);

  useEffect(() => {
    initializeTranslations().then(setLanguage);
  }, [setLanguage]);

  useEffect(() => {
    languageLoaded &&
      authLoaded &&
      loadUserData()
        .then(setUserDataLoaded)
        .catch(({ type }) => {
          showSnackbar(translate(`error.${type}`));
          setTimeout(() => setRetries((oldRetries) => oldRetries + 1), 3000);
        });
  }, [
    authLoaded,
    languageLoaded,
    setLanguage,
    setAuth,
    loadUserData,
    setUserDataLoaded,
    showSnackbar,
    retries,
  ]);

  useEffect(() => {
    authLoaded && languageLoaded && userDataLoaded && setAppLoaded();
  }, [authLoaded, languageLoaded, userDataLoaded, setAppLoaded]);

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
      <Snackbar />
    </ScreenWrapper>
  );
};

LoadingScreen.propTypes = {
  authLoaded: PropTypes.bool.isRequired,
  languageLoaded: PropTypes.bool.isRequired,
  userDataLoaded: PropTypes.bool.isRequired,
  loadUserData: PropTypes.func.isRequired,
  setAuth: PropTypes.func.isRequired,
  setLanguage: PropTypes.func.isRequired,
  setUserDataLoaded: PropTypes.func.isRequired,
  setAppLoaded: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  authLoaded: state.authReducer.authLoaded,
  languageLoaded: state.localeReducer.languageLoaded,
  userDataLoaded: state.authReducer.userDataLoaded,
});

const mapDispatchToProps = (dispatch) => ({
  setAuth: (payload) => dispatch(setAuthAction(payload)),
  setLanguage: (payload) => dispatch(setLanguageAction(payload)),
  setAppLoaded: () => dispatch(setAppLoadedAction()),
  loadUserData: () => dispatch(loadUserDataAction()),
  setUserDataLoaded: () => dispatch(setUserDataLoadedAction()),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoadingScreen);
