import React from 'react';
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {IconComponentProvider, ThemeProvider} from "@react-native-material/core";
import Navigation from "./components/navigation";
import {darkTheme, defaultTheme} from "@react-native-material/core/src/base/defaultTheme";
import useUserStore from "./store/user";
import Promise from 'bluebird';
import { LogBox } from 'react-native';

// TODO - This stops the error message that appeared after expo update 50.
// suggest upgrading libraries later on to fix this. Bloody bastard EXPO.
//  https://stackoverflow.com/questions/69538962/new-nativeeventemitter-was-called-with-a-non-null-argument-without-the-requir
LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

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
