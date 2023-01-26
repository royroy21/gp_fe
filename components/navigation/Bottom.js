import * as React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import {StyleSheet} from "react-native";
import {Icon, useTheme} from "@react-native-material/core";
import Home from "./Home";
import PlaceHolder from "./Placeholder";

export default function BottomNavigation() {
  const Tab = createMaterialBottomTabNavigator();
  const theme = useTheme()
  function iconConfig(focused) {
    return {
      size: 25,
      color: focused ? theme.palette.primary.main : "lightgrey",
    }
  }
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      barStyle={styles.navigator}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return <Icon name="pig" {...iconConfig(focused)} />
          }
        }}
      />
      <Tab.Screen
        name="Placeholder"
        component={PlaceHolder}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return <Icon name="music" {...iconConfig(focused)} />
          }
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  navigator: {
    backgroundColor: "white",
  }
});
