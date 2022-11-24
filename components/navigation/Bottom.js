import * as React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import TopNavigation from "./Top";
import {StyleSheet, Text, View} from "react-native";
import {Icon} from "@react-native-material/core";

const PlaceHolder = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{"meow"}</Text>
    </View>
  )
}

export default function BottomNavigation() {
  const Tab = createMaterialBottomTabNavigator();
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      barStyle={styles.navigator}
    >
      <Tab.Screen
        name="Home"
        component={TopNavigation}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return <Icon name="home" size={25} />
          }
        }}
      />
      <Tab.Screen
        name="placeholder"
        component={PlaceHolder}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return <Icon name="music" size={25} />
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
