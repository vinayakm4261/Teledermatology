import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import { connect } from 'react-redux';

import { ScreenWrapper, Title, Tagline } from '../components';
import RegisterForm from '../forms/Register';

import { registerStyles } from './styles';
import translate from '../locales/translate';
import useSnackbar from '../hooks/useSnackbar';

import { registerUserAction } from '../actions/authActions';

const RegisterScreen = ({ registerUser }) => {
  const styles = useMemo(registerStyles(), []);
  const { Snackbar, showSnackbar } = useSnackbar();

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <Title>{translate('app.name')}</Title>
          <Tagline>{translate('app.tagLine')}</Tagline>
        </View>
        <RegisterForm onSubmit={registerUser} onSubmitFail={showSnackbar} />
      </View>
      <Snackbar />
    </ScreenWrapper>
  );
};

RegisterScreen.propTypes = {
  registerUser: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  registerUser: (payload) => dispatch(registerUserAction(payload)),
});

export default connect(null, mapDispatchToProps)(RegisterScreen);
