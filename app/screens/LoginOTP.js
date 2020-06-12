import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import { connect } from 'react-redux';

import { ScreenWrapper, Title, Tagline } from '../components';
import LoginOTPForm from '../forms/LoginOTP';
import OTPIllustration from '../../assets/illustrations/OTPIllustration.svg';

import { loginStyles } from './styles';
import translate from '../locales/translate';
import useScreenDimensions from '../hooks/useScreenDimensions';
import useSnackbar from '../hooks/useSnackbar';

import { otpAction } from '../actions/authActions';

const LoginOTPScreen = ({ confirmOTP }) => {
  const { width } = useScreenDimensions();
  const styles = useMemo(loginStyles({ width }), [width]);
  const { Snackbar, showSnackbar } = useSnackbar();

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View>
          <Title>{translate('app.name')}</Title>
          <Tagline>{translate('app.tagLine')}</Tagline>
        </View>
        <View style={styles.illustrationContainer}>
          <OTPIllustration {...styles.illustration} />
        </View>
        <LoginOTPForm onSubmit={confirmOTP} onSubmitFail={showSnackbar} />
      </View>
      <Snackbar />
    </ScreenWrapper>
  );
};

LoginOTPScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  confirmOTP: (OTP) => dispatch(otpAction(OTP)),
});

export default connect(null, mapDispatchToProps)(LoginOTPScreen);
