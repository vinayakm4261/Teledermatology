import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { connect } from 'react-redux';

import { withFormik } from 'formik';
import * as yup from 'yup';
import moment from 'moment';

import {
  Button,
  ChippedTextInput,
  MediaUploaderInput,
  DateTimePicker,
  Label,
  ScreenWrapper,
} from '../components';
import formStyles from '../forms/styles';
import useFormSubmit from '../hooks/useFormSubmit';
import useSnackbar from '../hooks/useSnackbar';
import useScreenDimensions from '../hooks/useScreenDimensions';

const minimumDate = moment().add(1, 'd').toDate();
const maximumDate = moment().add(31, 'd').toDate();

const NewAppointmentScreen = ({
  // Form props
  values,
  dirty,
  isValid,
  isSubmitting,
  setSubmitting,
  // Screen props
  navigation,
  newAppointment,
}) => {
  const theme = useTheme();
  const { width } = useScreenDimensions();
  const { Snackbar, showSnackbar } = useSnackbar();

  const onSubmit = useCallback(
    (submittedValues) => {
      alert(`Submitting:\n ${JSON.stringify(submittedValues)}`);
      newAppointment && newAppointment(submittedValues);
      return Promise.resolve();
    },
    [newAppointment],
  );

  const handleSubmit = useFormSubmit({
    values,
    setSubmitting,
    onSubmit,
    onSubmitSuccess: navigation.goBack,
    onSubmitFail: showSnackbar,
  });

  const header = useMemo(
    () => ({
      title: 'New Appointment',
      actions: [{ icon: 'close', onPress: () => navigation.goBack() }],
    }),
    [navigation],
  );

  const renderFooter = useCallback(
    () => (
      <View
        style={{
          position: 'absolute',
          bottom: 8,
          left: 8,
          right: 8,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.colors.background,
          borderRadius: theme.roundness,
          elevation: 2,
        }}>
        <Button
          onPress={handleSubmit}
          mode="contained"
          loading={isSubmitting}
          disabled={!dirty || !isValid || isSubmitting}
          contentStyle={{ width: width - 16 }}>
          {isSubmitting ? '' : 'Confirm Details'}
        </Button>
      </View>
    ),
    [
      isSubmitting,
      handleSubmit,
      dirty,
      isValid,
      theme.colors.background,
      theme.roundness,
      width,
    ],
  );

  return (
    <ScreenWrapper
      {...{ header, renderFooter }}
      style={{
        paddingHorizontal: 16,
        paddingBottom: 64,
      }}>
      <View style={formStyles.inputGroup}>
        <Label>Timings</Label>
        <View style={formStyles.inputRow}>
          <DateTimePicker
            style={formStyles.inputRowLeft}
            name="date"
            disabled={isSubmitting}
            {...{ maximumDate, minimumDate }}
          />
          <DateTimePicker
            mode="time"
            style={formStyles.inputRowRight}
            name="time"
            minuteInterval={15}
            disabled={isSubmitting}
          />
        </View>
        <ChippedTextInput
          name="symptoms"
          label="Symptoms"
          buttonProps={{
            mode: 'contained',
            theme: { colors: { primary: theme.colors.accent } },
            dark: true,
          }}
          disabled={isSubmitting}
        />
        <MediaUploaderInput
          name="media"
          label="Media"
          buttonProps={{
            mode: 'contained',
            theme: { colors: { primary: theme.colors.accent } },
            dark: true,
          }}
          disabled={isSubmitting}
        />
      </View>
      <Snackbar />
    </ScreenWrapper>
  );
};

NewAppointmentScreen.propTypes = {
  newAppointment: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

const validation = yup.object().shape({
  date: yup
    .date()
    .min(minimumDate)
    .max(moment(maximumDate).add(1, 'd').toDate())
    .required(),
  time: yup.date().required(),
  symptoms: yup.array().of(yup.string()),
  media: yup.array().of(
    yup.object().shape({
      type: yup.string(),
      uri: yup.string(),
    }),
  ),
});

const initialValues = () => ({
  date: moment().add(7, 'd').toDate(),
  time: moment('10:00AM', 'hh:mmA').toDate(),
  symptoms: [],
  media: [],
});

const mapStateToProps = () => ({});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(
  withFormik({
    displayName: 'NewAppointmentForm',
    validationSchema: validation,
    mapPropsToValues: initialValues,
  })(NewAppointmentScreen),
);
