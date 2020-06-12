import React from 'react';
import PropTypes from 'prop-types';
import { View, ViewPropTypes } from 'react-native';

import { withFormik } from 'formik';
import * as yup from 'yup';

import {
  Headline,
  TextInput,
  Button,
  Picker,
  DateTimePicker,
  ChippedTextInput,
} from '../components';

import styles from './styles';
import translate from '../locales/translate';
import useFormSubmit from '../hooks/useFormSubmit';

const today = new Date();
const initialDate = new Date(1900, 0, 2);

const RegisterForm = ({
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
        <Headline>{translate('register.formTitle')}</Headline>
        <TextInput
          name="name"
          label={translate('register.fullNameLabel')}
          placeholder={translate('register.fullNamePlaceholder')}
          disabled={isSubmitting}
          maxLength={100}
          textContentType="name"
          autoCompleteType="name"
          autoCapitalize="words"
          returnKeyType="next"
        />
        <View style={styles.inputRow}>
          <DateTimePicker
            style={styles.inputRowLeft}
            name="dob"
            label={translate('register.dobLabel')}
            disabled={isSubmitting}
            maximumDate={today}
            minimumDate={initialDate}
          />
          <Picker
            style={styles.inputRowRight}
            name="gender"
            label={translate('register.genderLabel')}
            disabled={isSubmitting}
            items={[
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
            ]}
          />
        </View>
        <TextInput
          name="email"
          label={translate('register.emailLabel')}
          placeholder={translate('register.emailPlaceholder')}
          disabled={isSubmitting}
          textContentType="emailAddress"
          keyboardType="email-address"
          autoCompleteType="email"
          returnKeyType="next"
        />
        <ChippedTextInput
          name="diseases"
          label={translate('register.diseasesLabel')}
          placeholder={translate('register.diseasesPlaceholder')}
          disabled={isSubmitting}
        />
      </View>
      <Button
        onPress={handleSubmit}
        mode="contained"
        loading={isSubmitting}
        disabled={!dirty || !isValid || isSubmitting}>
        {isSubmitting ? '' : translate('register.registerButtonText')}
      </Button>
    </View>
  );
};

RegisterForm.propTypes = {
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
  name: yup
    .string()
    .required()
    .matches(/^([a-zA-Z]{3,30}\s*)+$/g),
  dob: yup.date().min(initialDate).max(today).required(),
  gender: yup.mixed().oneOf(['male', 'female']).required(),
  email: yup.string().email(),
  diseases: yup.array().of(yup.string()),
});

const initialValues = () => ({
  name: '',
  dob: new Date(),
  gender: 'male',
  email: '',
  diseases: [],
});

export default withFormik({
  displayName: 'RegisterForm',
  validationSchema: validation,
  mapPropsToValues: initialValues,
})(RegisterForm);
