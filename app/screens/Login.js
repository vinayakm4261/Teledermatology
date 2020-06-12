import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import { connect } from 'react-redux';

import { ScreenWrapper, Title, Tagline } from '../components';
import LoginIllustration from '../../assets/illustrations/LoginIllustration.svg';
import LoginForm from '../forms/Login';

import { loginStyles } from './styles';
import useScreenDimensions from '../hooks/useScreenDimensions';
import useSnackbar from '../hooks/useSnackbar';
import translate from '../locales/translate';

import { loginWithPhoneAction } from '../actions/authActions';

const LoginScreen = ({ navigation, loginWithPhoneNumber }) => {
  const { width } = useScreenDimensions();
  const styles = useMemo(loginStyles({ width }), [width]);
  const { Snackbar, showSnackbar } = useSnackbar();

  const goToOTPScreen = useCallback(() => {
    navigation.navigate('LoginOTP');
  }, [navigation]);

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <Title>{translate('app.name')}</Title>
          <Tagline>{translate('app.tagLine')}</Tagline>
        </View>
        <View style={styles.illustrationContainer}>
          <LoginIllustration {...styles.illustration} />
        </View>
        <LoginForm
          onSubmit={loginWithPhoneNumber}
          onSubmitSuccess={goToOTPScreen}
          onSubmitFail={showSnackbar}
        />
      </View>
      <Snackbar />
    </ScreenWrapper>
  );
};

LoginScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  loginWithPhoneNumber: (phoneNumber) =>
    dispatch(loginWithPhoneAction(phoneNumber)),
});

export default connect(null, mapDispatchToProps)(LoginScreen);
