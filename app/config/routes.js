import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from '../screens/Login';
import LoginOTP from '../screens/LoginOTP';
import Register from '../screens/Register';
import Home from '../screens/Home';
import Camera from '../screens/Camera';

const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator
      headerMode="none"
      screenOptions={{ cardStyle: { backgroundColor: '#FFFFFF' } }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="LoginOTP" component={LoginOTP} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Camera" component={Camera} />
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  );
};

const Navigator = () => (
  <NavigationContainer>
    <StackNavigator />
  </NavigationContainer>
);

export default Navigator;
