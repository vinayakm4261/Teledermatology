import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  Text,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import { Title, Button, TextInput } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import { Field, reduxForm } from 'redux-form';

import { otpConfirm } from '../actions/authActions';

import translate from '../locales/translate';
import useForceUpdate from '../hooks/useForceUpdate';

const styles = StyleSheet.create({});

/* Just for testing, make it a component */
const CustomField = ({ input: { value, onChange }, ...props }) => (
  <TextInput value={value} onChange={onChange} {...props} />
);

const Login = (props) => {
  const forceUpdate = useForceUpdate();
  const [phoneNumber, setPhoneNumber] = useState('+916969420420');

  const [confirm, setConfirm] = useState(null);

  useEffect(() => {
    forceUpdate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendOTP = () => {
    auth()
      .signInWithPhoneNumber(phoneNumber)
      .then(setConfirm)
      .catch((err) => alert(err));
  };

  const confirmOTP = async (values, dispatch) => {
    try {
      const response = await confirm.confirm(values.otp);

      return new Promise((resolve, reject) => {
        dispatch(
          otpConfirm(response.phoneNumber, response.uid, resolve, reject),
        );
      });
    } catch (err) {
      console.log(err);
    }
  };

  const { handleSubmit, submitting } = props;

  return (
    <View
      style={{
        flex: 1,
        marginTop: 16,
        marginHorizontal: 16,
      }}>
      <StatusBar animated backgroundColor="#FFFFFF" barStyle="dark-content" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <Title>Login</Title>
          <TextInput
            label="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            textContentType="telephoneNumber"
            keyboardType="phone-pad"
            style={{ marginVertical: 16, height: 56 }}
          />
          <Button mode="contained" onPress={sendOTP}>
            Next
          </Button>
          <Field
            name="otp"
            label="Enter OTP"
            textContentType="oneTimeCode"
            keyboardType="number-pad"
            style={{ marginVertical: 16, height: 56 }}
            component={CustomField}
          />
          <Button
            mode="contained"
            disabled={!confirm}
            loading={submitting}
            onPress={handleSubmit(confirmOTP)}>
            {translate('login.buttonText')}
          </Button>
          <Button
            mode="contained"
            style={{ marginVertical: 16 }}
            onPress={() => props.navigation.navigate('Home')}>
            Test
          </Button>
          <Text style={{ marginBottom: 16, fontFamily: 'NotoSans-Bold' }}>
            {translate('login.phone')}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

Login.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.func),
};

export default reduxForm({
  form: 'otpForm',
  initialValues: {
    otp: '123456',
  },
  onSubmitSuccess: (result, dispatch, props) => {
    props.navigation.navigate(result.navigate);
  },
  onSubmitFail: (errors, dispatch, submitError, props) => {
    Alert.alert('Login Error', submitError._error);
  },
})(Login);
