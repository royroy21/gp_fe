import React from 'react';
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {IconComponentProvider, ThemeProvider} from "@react-native-material/core";
import Navigation from "./components/navigation";
import {darkTheme, defaultTheme} from "@react-native-material/core/src/base/defaultTheme";
import useUserStore from "./store/user";
import Promise from 'bluebird';

// Using Bluebird to give improved stack tracks.
// For example where in the code a promise isn't correctly handled.
global.Promise = Promise;

// Global catch of unhandled Promise rejections.
global.onunhandledrejection = function onunhandledrejection(error) {
  // Warning: when running in "remote debug" mode (JS environment is Chrome browser),
  // this handler is called a second time by Bluebird with a custom "dom-event".
  // We need to filter this case out:
  if (error instanceof Error) {
    console.log(error);
    error.stack && console.error("Stack Trace:", error.stack);
  }
};

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
