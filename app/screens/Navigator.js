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
import NewAppointmentScreen from './NewAppointment';

import DoctorHomeScreen from './DoctorHome';
import DoctorProfile from './DoctorProfile';
import DoctorProfileEdit from './DoctorProfileEdit';

const AuthStack = createStackNavigator();
const RootStack = createStackNavigator();

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
    ) : (
      <RootStack.Navigator headerMode="none">
        {!isDoctor ? (
          <>
            <RootStack.Screen name="Home" component={PatientHomeScreen} />
            <RootStack.Screen name="Profile" component={PatientProfileScreen} />
            <RootStack.Screen
              name="PatientProfileEdit"
              component={PatientProfileEditScreen}
            />
            <RootStack.Screen
              name="NewAppointment"
              component={NewAppointmentScreen}
            />
          </>
        ) : (
          <>
            <RootStack.Screen name="Home" component={DoctorHomeScreen} />
            <RootStack.Screen name="DoctorProfile" component={DoctorProfile} />
            <RootStack.Screen
              name="DoctorProfileEdit"
              component={DoctorProfileEdit}
            />
          </>
        )}
      </RootStack.Navigator>
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
