import React from 'react';
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {IconComponentProvider} from "@react-native-material/core";
import {UserProvider} from "./components/context/user";
import Navigation from "./components/navigation";

export default function App() {
  return (
    <UserProvider>
      <IconComponentProvider IconComponent={MaterialCommunityIcons}>
       <Navigation />
      </IconComponentProvider>
    </UserProvider>
  )
}
