import React from 'react';
import PropTypes from 'prop-types';
import { View, ViewPropTypes } from 'react-native';

import { withFormik } from 'formik';
import * as yup from 'yup';

import { Headline, TextInput, Button } from '../components';

import styles from './styles';
import translate from '../locales/translate';
import useFormSubmit from '../hooks/useFormSubmit';

const formatValues = ({ phoneNumber }) => ({
  phoneNumber: phoneNumber.replace(/\s+/g, ''),
});

const LoginForm = ({
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
    formatValues,
    setSubmitting,
    onSubmit,
    onSubmitSuccess,
    onSubmitFail,
  });

  return (
    <View style={style}>
      <View style={styles.inputGroup}>
        <Headline>{translate('login.phoneNumberLabel')}</Headline>
        <TextInput
          name="phoneNumber"
          placeholder={translate('login.phoneNumberPlaceholder')}
          disabled={isSubmitting}
          textContentType="telephoneNumber"
          keyboardType="phone-pad"
          autoCompleteType="tel"
          maxLength={25}
          returnKeyType="done"
        />
      </View>
      <Button
        onPress={handleSubmit}
        mode="contained"
        loading={isSubmitting}
        disabled={!dirty || !isValid || isSubmitting}>
        {isSubmitting ? '' : translate('login.continueButtonText')}
      </Button>
    </View>
  );
};

LoginForm.propTypes = {
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
  phoneNumber: yup
    .string()
    .matches(/^\+(\d\s?){12}$/g)
    .required(),
});

const initialValues = () => ({
  phoneNumber: '+91 ',
});

export default withFormik({
  displayName: 'LoginForm',
  validationSchema: validation,
  mapPropsToValues: initialValues,
})(LoginForm);
