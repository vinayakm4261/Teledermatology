import React, { useCallback, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { View, ViewPropTypes } from 'react-native';
import { FAB, useTheme, Avatar } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { connect } from 'react-redux';
import { withFormik } from 'formik';
import * as yup from 'yup';

import {
  ScreenWrapper,
  TextInput,
  Picker,
  DateTimePicker,
  ChippedTextInput,
  Subheading,
  ProfilePicturePicker,
} from '../components';

import { registerStyles } from './styles';
import styles from '../forms/styles';
import translate from '../locales/translate';
import useFormSubmit from '../hooks/useFormSubmit';
import useSnackbar from '../hooks/useSnackbar';
import usePickerDialog from '../hooks/usePickerDialog';

import { patientProfileEditAction } from '../actions/infoActions';

const today = new Date();
const initialDate = new Date(1900, 0, 2);

const PatientProfileEdit = ({
  // Form props
  values,
  dirty,
  isValid,
  isSubmitting,
  setSubmitting,
  // Screen props
  navigation,
  patientProfileEdit,
  userData,
}) => {
  const theme = useTheme();
  const [photoUpdated, setPhotoUpdated] = useState(false);
  const [photo, setPhoto] = useState({ uri: userData.profilePic });

  const { container: containerStyle } = useMemo(registerStyles(), []);
  const { Snackbar, showSnackbar } = useSnackbar();

  const handleSubmit = useFormSubmit({
    values: { photoUpdated, photo, updateData: values },
    setSubmitting,
    onSubmit: patientProfileEdit,
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
        <View style={[styles.inputGroup]}>
          <Subheading style={{ paddingBottom: 16 }}>
            {translate('profileEdit.patientFormTitle')}
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
              label={translate('register.fullNameLabel')}
              placeholder={translate('register.fullNamePlaceholder')}
              disabled={isSubmitting}
              maxLength={100}
              textContentType="name"
              autoCompleteType="name"
              autoCapitalize="words"
              returnKeyType="next"
            />
          </View>
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
            label={translate('profileEdit.patientFormEmailLabel')}
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
      </ScreenWrapper>
      {profilePicturePicker.dialog}
      <Snackbar />
    </>
  );
};

PatientProfileEdit.propTypes = {
  values: PropTypes.shape({}).isRequired,
  dirty: PropTypes.bool.isRequired,
  isValid: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  setSubmitting: PropTypes.func.isRequired,
  style: ViewPropTypes.style,
};

const mapStateToProps = (state) => ({
  userData: state.authReducer.userData,
});

const mapDispatchToProps = (dispatch) => ({
  patientProfileEdit: (payload) => dispatch(patientProfileEditAction(payload)),
});

const validation = yup.object().shape({
  name: yup
    .string()
    .required()
    .matches(/^([a-zA-Z]{3,30}\s*)+$/g),
  dob: yup.date().min(initialDate).max(today).required(),
  gender: yup.mixed().oneOf(['male', 'female']).required(),
  email: yup.string().email().required(),
  diseases: yup.array().of(yup.string()),
});

const initialValues = (props) => ({
  name: props.userData.name,
  dob: new Date(props.userData.dob),
  gender: props.userData.gender,
  email: props.userData.email,
  diseases: props.userData.diseases,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(
  withFormik({
    displayName: 'PatientProfileEditForm',
    validationSchema: validation,
    mapPropsToValues: initialValues,
  })(PatientProfileEdit),
);
