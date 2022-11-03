import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DefaultScreen from "./components/home/DefaultScreen";
import LoginForm from "./components/forms/Login";

export default function App() {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="LoginScreen"
          component={LoginForm}
          options={{ title: 'Login screen' }}
        />
        <Stack.Screen
          name="DefaultScreen"
          component={DefaultScreen}
          options={{ title: 'Default screen' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
