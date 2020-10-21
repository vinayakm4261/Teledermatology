import React from 'react';
import PropTypes from 'prop-types';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { connect } from 'react-redux';

import LoginScreen from './Login';
import LoginOTPScreen from './LoginOTP';
import RegisterScreen from './Register';
import LoadingScreen from './Loading';
import HomeChat from './HomeChat';
import ChatScreen from './Chat';

import PatientHomeScreen from './PatientHome';
import PatientProfileScreen from './PatientProfile';
import PatientProfileEditScreen from './PatientProfileEdit';
import NewAppointmentScreen from './NewAppointment';

import DoctorHomeScreen from './DoctorHome';
import DoctorProfile from './DoctorProfile';
import DoctorProfileEdit from './DoctorProfileEdit';

import HomeVideo from './HomeVideo';
import Video from './Video';
import ViewAppointment from './ViewAppointment';

const AuthStack = createStackNavigator();
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
      <AuthStack.Navigator headerMode="none">
        <AuthStack.Screen name="Login" component={LoginScreen} />
        <AuthStack.Screen name="LoginOTP" component={LoginOTPScreen} />
      </AuthStack.Navigator>
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
        <Stack.Screen name="HomeChat" component={HomeChat} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="ViewAppointment" component={ViewAppointment} />
        <Stack.Screen name="NewAppointment" component={NewAppointmentScreen} />
      </Stack.Navigator>
    ) : (
      <Stack.Navigator headerMode="none">
        <Stack.Screen name="Home" component={DoctorHomeScreen} />
        <Stack.Screen name="DoctorProfile" component={DoctorProfile} />
        <Stack.Screen name="DoctorProfileEdit" component={DoctorProfileEdit} />
        <Stack.Screen name="HomeVideo" component={HomeVideo} />
        <Stack.Screen name="Video" component={Video} />
        <Stack.Screen name="HomeChat" component={HomeChat} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="ViewAppointment" component={ViewAppointment} />
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
