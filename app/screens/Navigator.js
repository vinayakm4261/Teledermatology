import React from 'react';
import PropTypes from 'prop-types';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { connect } from 'react-redux';

import LoginScreen from './Login';
import LoginOTPScreen from './LoginOTP';
import RegisterScreen from './Register';
import HomeScreen from './Home';
import LoadingScreen from './Loading';

const Stack = createStackNavigator();

const Navigator = ({
  appLoaded = false,
  userLoggedIn = false,
  userRegistered = false,
}) => (
  <NavigationContainer>
    {!appLoaded ? (
      <LoadingScreen />
    ) : !userLoggedIn ? (
      <Stack.Navigator headerMode="None">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="LoginOTP" component={LoginOTPScreen} />
      </Stack.Navigator>
    ) : !userRegistered ? (
      <RegisterScreen />
    ) : (
      <HomeScreen />
    )}
  </NavigationContainer>
);

Navigator.propTypes = {
  appLoaded: PropTypes.bool.isRequired,
  userLoggedIn: PropTypes.bool.isRequired,
  userRegistered: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  appLoaded: state.localeReducer.appLoaded,
  userLoggedIn: state.authReducer.userLoggedIn,
  userRegistered: state.authReducer.userRegistered,
});

export default connect(mapStateToProps)(Navigator);
