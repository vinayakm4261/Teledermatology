import React from 'react';
import PropTypes from 'prop-types';
import { View, ViewPropTypes } from 'react-native';

import { withFormik } from 'formik';
import * as yup from 'yup';

import { Headline, TextInput, Button } from '../components';

import styles from './styles';
import translate from '../locales/translate';
import useFormSubmit from '../hooks/useFormSubmit';

const LoginOTPForm = ({
  // Form props
  values,
  dirty,
  isValid,
  isSubmitting,
  setSubmitting,
  // Screen props
  style,
  onSubmit,
  onSubmitSuccess,
  onSubmitFail,
}) => {
  const handleSubmit = useFormSubmit({
    values,
    setSubmitting,
    onSubmit,
    onSubmitSuccess,
    onSubmitFail,
  });

  return (
    <View style={style}>
      <View style={styles.inputGroup}>
        <Headline>{translate('otp.otpLabel')}</Headline>
        <TextInput
          name="otp"
          placeholder={translate('otp.otpPlaceholder')}
          disabled={isSubmitting}
          textContentType="oneTimeCode"
          keyboardType="number-pad"
          maxLength={6}
          returnKeyType="done"
        />
      </View>
      <Button
        onPress={handleSubmit}
        mode="contained"
        loading={isSubmitting}
        disabled={!dirty || !isValid || isSubmitting}>
        {isSubmitting ? '' : translate('otp.loginButtonText')}
      </Button>
    </View>
  );
};

LoginOTPForm.propTypes = {
  values: PropTypes.shape({}).isRequired,
  dirty: PropTypes.bool.isRequired,
  isValid: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  setSubmitting: PropTypes.func.isRequired,
  style: ViewPropTypes.style,
  onSubmit: PropTypes.func.isRequired,
  onSubmitSuccess: PropTypes.func,
  onSubmitFail: PropTypes.func,
};

const validation = yup.object().shape({
  otp: yup
    .string()
    .length(6)
    .matches(/^(\d){6}$/g)
    .required(),
});

const initialValues = () => ({
  otp: '',
});

export default withFormik({
  displayName: 'LoginOTPForm',
  validationSchema: validation,
  mapPropsToValues: initialValues,
})(LoginOTPForm);
