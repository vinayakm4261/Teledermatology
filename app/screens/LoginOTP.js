import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { View, Alert } from 'react-native';
import { Snackbar } from 'react-native-paper';

import { Field, reduxForm } from 'redux-form';

import {
  ScreenWrapper,
  Title,
  Tagline,
  Headline,
  Button,
  ReduxCompatTextInput,
} from '../components';
import OTPIllustration from '../../assets/illustrations/OTPIllustration.svg';

import { loginStyles } from './styles';
import translate from '../locales/translate';
import useScreenDimensions from '../hooks/useScreenDimensions';

import { otpConfirm } from '../actions/authActions';
import { otpValidation } from '../helpers/validation';

const LoginOTP = ({
  navigation,
  route: {
    params: { confirmation },
  },
  handleSubmit,
  submitting,
  valid,
}) => {
  // Set up styling
  const { width } = useScreenDimensions();
  const styles = useMemo(loginStyles({ width }), [width]);

  const [snackbarVisible, setSnackBarVisible] = useState(false);

  // Set up functionality
  const showSnackbar = useCallback(() => setSnackBarVisible(true), []);
  const handleSnackbarDismiss = useCallback(
    () => setSnackBarVisible(false),
    [],
  );

  const confirmOTP = useCallback(
    async (values, dispatch) => {
      try {
        const { phoneNumber, uid } = await confirmation.confirm(values.otp);

        return new Promise((resolve, reject) => {
          dispatch(otpConfirm(phoneNumber, uid, resolve, reject));
          navigation.navigate('Home');
        });
      } catch (err) {
        showSnackbar();
      }
    },
    [confirmation, navigation, showSnackbar],
  );

  // Render
  return (
    <>
      <ScreenWrapper>
        <View style={styles.container}>
          <View>
            <Title>{translate('app.name')}</Title>
            <Tagline>{translate('app.tagLine')}</Tagline>
          </View>
          <View style={styles.illustrationContainer}>
            <OTPIllustration {...styles.illustration} />
          </View>
          <View>
            <View style={styles.inputGroup}>
              <Headline>{translate('otp.otpLabel')}</Headline>
              <Field
                name="otp"
                component={ReduxCompatTextInput}
                placeholder={translate('otp.otpPlaceholder')}
                textContentType="oneTimeCode"
                keyboardType="number-pad"
                validate={otpValidation}
                maxLength={6}
                returnKeyType="done"
              />
            </View>
            <Button
              onPress={handleSubmit(confirmOTP)}
              mode="contained"
              disabled={!valid || submitting}
              loading={submitting}>
              {submitting ? '' : translate('otp.loginButtonText')}
            </Button>
          </View>
        </View>
      </ScreenWrapper>
      <Snackbar
        theme="error"
        visible={snackbarVisible}
        onDismiss={handleSnackbarDismiss}
        duration={Snackbar.DURATION_SHORT}>
        {translate('otp.loginError')}
      </Snackbar>
    </>
  );
};

LoginOTP.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      confirmation: PropTypes.shape({
        confirm: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  valid: PropTypes.bool.isRequired,
};

export default reduxForm({
  form: 'otpForm',
  initialValues: {
    otp: '',
  },
  //  onSubmitSuccess: (result, _dispatch, props) => {
  //    props.navigation.navigate(result.navigate);
  //  },
  //  onSubmitFail: (_errors, _dispatch, submitError, _props) => {
  //    Alert.alert('LoginOTP Error', submitError._error);
  //  },
})(LoginOTP);
