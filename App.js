import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DefaultScreen from "./components/home/DefaultScreen";
import LoginForm from "./components/forms/Login";
import SignupForm from "./components/forms/SignUp";

export default function App() {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="DefaultScreen">
        <Stack.Screen
          name="LoginScreen"
          component={LoginForm}
          options={{ title: 'Login' }}
        />
        <Stack.Screen
          name="DefaultScreen"
          component={DefaultScreen}
          options={{ title: 'GigPig' }}
        />
        <Stack.Screen
          name="SignUpScreen"
          component={SignupForm}
          options={{ title: 'Sign up' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
