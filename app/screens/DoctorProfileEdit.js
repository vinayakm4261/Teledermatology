import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Avatar, FAB, useTheme } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { connect } from 'react-redux';
import * as yup from 'yup';
import { withFormik } from 'formik';
import moment from 'moment';

import {
  ScreenWrapper,
  TextInput,
  Subheading,
  DateTimePicker,
  DateRangePicker,
  Label,
  ProfilePicturePicker,
} from '../components';

import { registerStyles } from './styles';
import styles from '../forms/styles';
import translate from '../locales/translate';
import useSnackbar from '../hooks/useSnackbar';
import useFormSubmit from '../hooks/useFormSubmit';
import usePickerDialog from '../hooks/usePickerDialog';

import { doctorProfileEditAction } from '../actions/infoActions';

const today = new Date();

const DoctorProfileEdit = ({
  // Form props
  values,
  dirty,
  isValid,
  isSubmitting,
  setSubmitting,
  // Screen props
  userData,
  navigation,
  doctorProfileEdit,
}) => {
  const theme = useTheme();
  const [photoUpdated, setPhotoUpdated] = useState(false);
  const [photo, setPhoto] = useState({ uri: userData.profilePic });

  const { container: containerStyle } = useMemo(registerStyles(), []);
  const { Snackbar, showSnackbar } = useSnackbar();

  const handleSubmit = useFormSubmit({
    values: {
      photoUpdated,
      photo,
      updateData: {
        ...values,
        availability: {
          startDate: values.availability.split('|')[0].trim(),
          endDate: values.availability.split('|')[1].trim(),
          startTime: values.startTime,
          endTime: values.endTime,
        },
      },
    },
    setSubmitting,
    onSubmit: doctorProfileEdit,
    onSubmitFail: showSnackbar,
    onSubmitSuccess: navigation.goBack,
  });

  const handlePicked = useCallback((pickedPhoto) => {
    setPhoto(pickedPhoto);
    setPhotoUpdated(true);
  }, []);

  const profilePicturePicker = usePickerDialog({
    Picker: ProfilePicturePicker,
    onError: showSnackbar,
    onPicked: handlePicked,
  });

  const header = useMemo(
    () => ({
      title: translate('profile.title'),
      backAction: navigation.goBack,
    }),
    [navigation],
  );

  const renderFooter = useCallback(
    () => (
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          margin: 16,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {(dirty || photoUpdated) && (
          <FAB
            icon="check"
            label={isSubmitting ? '' : translate('register.registerButtonText')}
            theme={{ colors: { accent: theme.colors.primary } }}
            onPress={handleSubmit}
            loading={isSubmitting}
            disabled={!isValid || isSubmitting}
          />
        )}
      </View>
    ),
    [
      dirty,
      photoUpdated,
      handleSubmit,
      isSubmitting,
      isValid,
      theme.colors.primary,
    ],
  );

  return (
    <>
      <ScreenWrapper
        {...{ header, renderFooter }}
        style={{ ...containerStyle, paddingBottom: 80 }}>
        <View style={styles.inputGroup}>
          <Subheading>{translate('profileEdit.formTitle1')}</Subheading>
          <Label>{translate('profileEdit.dateLabel')}</Label>
          <DateRangePicker name="availability" minDate={today} />
          <Label>{translate('profileEdit.timeLabel')}</Label>
          <View style={styles.inputRow}>
            <DateTimePicker
              mode="time"
              style={styles.inputRowLeft}
              name="startTime"
              minuteInterval={15}
              disabled={isSubmitting}
            />
            <Label style={{ fontSize: 14 }}>
              {translate('profileEdit.to')}
            </Label>
            <DateTimePicker
              mode="time"
              style={styles.inputRowRight}
              name="endTime"
              minuteInterval={15}
              disabled={isSubmitting}
            />
          </View>
          <Subheading style={{ marginVertical: 10 }}>
            {translate('profileEdit.formTitle2')}
          </Subheading>
          <View style={[styles.inputRow, { alignItems: 'flex-end' }]}>
            <View>
              <Avatar.Image
                source={photo}
                size={96}
                style={styles.inputRowLeft}
              />
              <FAB
                style={{
                  position: 'absolute',
                  marginRight: 10,
                  right: 0,
                  bottom: 0,
                  height: 30,
                  width: 30,
                }}
                small
                icon={() => (
                  <MaterialIcons size={16} color="white" name="edit" />
                )}
                theme={{ colors: { accent: theme.colors.primary } }}
                onPress={profilePicturePicker.showDialog}
              />
            </View>
            <TextInput
              style={styles.inputRowRight}
              name="name"
              label={translate('profileEdit.nameLabel')}
              disabled={isSubmitting}
              maxLength={100}
              textContentType="name"
              autoCompleteType="name"
              autoCapitalize="words"
              returnKeyType="next"
            />
          </View>
          <TextInput
            name="hospital"
            label={translate('profileEdit.hospitalLabel')}
            disabled={isSubmitting}
            maxLength={100}
            textContentType="name"
            autoCompleteType="name"
            autoCapitalize="words"
            returnKeyType="next"
          />
          <TextInput
            name="type"
            label={translate('profileEdit.typeLabel')}
            disabled={isSubmitting}
            maxLength={100}
            textContentType="name"
            autoCompleteType="name"
            autoCapitalize="words"
            returnKeyType="next"
          />
          <TextInput
            name="email"
            label={translate('profileEdit.emailLabel')}
            disabled={isSubmitting}
            textContentType="emailAddress"
            keyboardType="email-address"
            autoCompleteType="email"
            returnKeyType="next"
          />
        </View>
      </ScreenWrapper>
      {profilePicturePicker.dialog}
      <Snackbar />
    </>
  );
};

DoctorProfileEdit.propTypes = {
  values: PropTypes.shape({}).isRequired,
  dirty: PropTypes.bool.isRequired,
  isValid: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  setSubmitting: PropTypes.func.isRequired,
};

const validation = yup.object().shape({
  name: yup
    .string()
    .required()
    .matches(/^([a-zA-Z]{3,30}\s*)+$/g),
  startTime: yup.date().required(),
  endTime: yup.date().required(),
  hospital: yup.string().required(),
  type: yup.string().required(),
  email: yup.string().email().required(),
  availability: yup.string().required(),
});

const initialValues = ({ userData }) => ({
  name: userData.name,
  startTime: moment(userData.availability.startTime, 'hh:mm A').toDate(),
  endTime: moment(userData.availability.endTime, 'hh:mm A').toDate(),
  hospital: userData.hospital,
  type: userData.department,
  email: userData.email,
  availability: `${userData.availability.startDate} | ${userData.availability.endDate}`,
});

const mapStateToProps = (state) => ({
  userData: state.authReducer.userData,
});

const mapDispatchToProps = (dispatch) => ({
  doctorProfileEdit: (payload) => dispatch(doctorProfileEditAction(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(
  withFormik({
    displayName: 'DoctorProfileEditForm',
    validationSchema: validation,
    mapPropsToValues: initialValues,
  })(DoctorProfileEdit),
);
