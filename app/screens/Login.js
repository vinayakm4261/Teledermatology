import React, { useState, useCallback, useMemo } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import auth from '@react-native-firebase/auth';

import {
  ScreenWrapper,
  Title,
  Tagline,
  Headline,
  Button,
  TextInput,
} from '../components';
import LoginIllustration from '../../assets/illustrations/LoginIllustration.svg';

import { loginStyles } from './styles';
import useScreenDimensions from '../hooks/useScreenDimensions';
import translate from '../locales/translate';

import validate from '../helpers/validation';

const Login = ({ navigation }) => {
  // Set up styling
  const { width } = useScreenDimensions();
  const styles = useMemo(loginStyles({ width }), [width]);

  // Set up functionality
  const [phoneNumber, setPhoneNumber] = useState('+91 ');
  const [submitting, setSubmitting] = useState(false);
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(false);

  const handlePhoneNumberChange = useCallback((newPhoneNumber) => {
    setIsPhoneNumberValid(validate('phoneNumber', newPhoneNumber));
    setPhoneNumber(newPhoneNumber);
  }, []);

  const sendOTP = useCallback(() => {
    setSubmitting(true);
    auth()
      .signInWithPhoneNumber(phoneNumber.replace(/\s+/g, ''))
      .then((confirmation) => {
        navigation.push('LoginOTP', { confirmation, phoneNumber });
      })
      .catch((err) => {
        alert(err);
      })
      .finally(() => {
        setSubmitting(false);
      });
  }, [phoneNumber, navigation]);

  // Render
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
        <View>
          <View style={styles.inputGroup}>
            <Headline>{translate('login.phoneNumberLabel')}</Headline>
            <TextInput
              placeholder={translate('login.phoneNumberPlaceholder')}
              value={phoneNumber}
              onChangeText={handlePhoneNumberChange}
              disabled={submitting}
              textContentType="telephoneNumber"
              keyboardType="phone-pad"
              autoCompleteType="tel"
              maxLength={25}
              returnKeyType="done"
            />
          </View>
          <Button
            onPress={sendOTP}
            mode="contained"
            loading={submitting}
            disabled={!isPhoneNumberValid || submitting}>
            {submitting ? '' : translate('login.continueButtonText')}
          </Button>
        </View>
      </View>
    </ScreenWrapper>
  );
};

Login.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default Login;
