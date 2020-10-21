import React from 'react';
import PropTypes from 'prop-types';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { connect } from 'react-redux';

import LoginScreen from './Login';
import LoginOTPScreen from './LoginOTP';
import RegisterScreen from './Register';
import LoadingScreen from './Loading';

import PatientHomeScreen from './PatientHome';
import PatientProfileScreen from './PatientProfile';
import PatientProfileEditScreen from './PatientProfileEdit';

import DoctorHomeScreen from './DoctorHome';
import DoctorProfile from './DoctorProfile';
import DoctorProfileEdit from './DoctorProfileEdit';

import HomeVideo from './HomeVideo';
import Video from './Video';

const Stack = createStackNavigator();

const Navigator = ({
  appLoaded = false,
  userLoggedIn = false,
  userRegistered = false,
  isDoctor = false,
}) => (
  <NavigationContainer>
    {!appLoaded ? (
      <LoadingScreen />
    ) : !userLoggedIn ? (
      <Stack.Navigator headerMode="none">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="LoginOTP" component={LoginOTPScreen} />
      </Stack.Navigator>
    ) : !userRegistered ? (
      <RegisterScreen />
    ) : !isDoctor ? (
      <Stack.Navigator headerMode="none">
        <Stack.Screen name="Home" component={PatientHomeScreen} />
        <Stack.Screen name="Profile" component={PatientProfileScreen} />
        <Stack.Screen
          name="PatientProfileEdit"
          component={PatientProfileEditScreen}
        />
        <Stack.Screen name="HomeVideo" component={HomeVideo} />
        <Stack.Screen name="Video" component={Video} />
      </Stack.Navigator>
    ) : (
      <Stack.Navigator headerMode="none">
        <Stack.Screen name="Home" component={DoctorHomeScreen} />
        <Stack.Screen name="DoctorProfile" component={DoctorProfile} />
        <Stack.Screen name="DoctorProfileEdit" component={DoctorProfileEdit} />
        <Stack.Screen name="HomeVideo" component={HomeVideo} />
        <Stack.Screen name="Video" component={Video} />
      </Stack.Navigator>
    )}
  </NavigationContainer>
);

Navigator.propTypes = {
  appLoaded: PropTypes.bool.isRequired,
  userLoggedIn: PropTypes.bool.isRequired,
  userRegistered: PropTypes.bool.isRequired,
  isDoctor: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  appLoaded: state.localeReducer.appLoaded,
  userLoggedIn: state.authReducer.userLoggedIn,
  userRegistered: state.authReducer.userRegistered,
  isDoctor: state.authReducer.isDoctor,
});

export default connect(mapStateToProps)(Navigator);
