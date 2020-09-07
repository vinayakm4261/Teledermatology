import React from 'react';
import PropTypes from 'prop-types';
import { View, ViewPropTypes } from 'react-native';

import { withFormik } from 'formik';
import * as yup from 'yup';
import moment from 'moment';

import { Button, ChippedTextInput, DateTimePicker, Label } from '../components';

import styles from './styles';
import translate from '../locales/translate';
import useFormSubmit from '../hooks/useFormSubmit';

const minimumDate = moment().add(1, 'd').toDate();
const maximumDate = moment().add(31, 'd').toDate();

const NewAppointmentForm = ({
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
        <Label>Timings</Label>
        <View style={styles.inputRow}>
          <DateTimePicker
            style={styles.inputRowLeft}
            name="date"
            disabled={isSubmitting}
            {...{ maximumDate, minimumDate }}
          />
          <DateTimePicker
            mode="time"
            style={styles.inputRowRight}
            name="time"
            disabled={isSubmitting}
          />
        </View>
        <ChippedTextInput
          name="symptoms"
          label="Symptoms"
          placeholder="Any symptoms"
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

NewAppointmentForm.propTypes = {
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
  date: yup
    .date()
    .min(minimumDate)
    .max(moment(maximumDate).add(1, 'd').toDate())
    .required(),
  time: yup.date().required(),
  symptoms: yup.array().of(yup.string()),
});

const initialValues = () => ({
  date: moment().add(7, 'd').toDate(),
  time: moment('10:00AM', 'hh:mmA').toDate(),
  symptoms: [],
});

export default withFormik({
  displayName: 'NewAppointmentForm',
  validationSchema: validation,
  mapPropsToValues: initialValues,
})(NewAppointmentForm);
