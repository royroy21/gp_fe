import React from 'react';
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {IconComponentProvider, ThemeProvider} from "@react-native-material/core";
import Navigation from "./components/navigation";
import {darkTheme, defaultTheme} from "@react-native-material/core/src/base/defaultTheme";
import useUserStore from "./store/user";

export default function App() {
  const {object} = useUserStore();
  const user = object || {};
  const theme = user.theme === "light" ? defaultTheme : darkTheme;
  return (
    <ThemeProvider theme={theme}>
      <IconComponentProvider IconComponent={MaterialCommunityIcons}>
        <Navigation />
      </IconComponentProvider>
    </ThemeProvider>
  )
}
