import React, {useEffect} from 'react';
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {IconComponentProvider, ThemeProvider} from "@react-native-material/core";
import Navigation from "./components/navigation";
import { darkTheme } from "@react-native-material/core/src/base/defaultTheme";
import Promise from 'bluebird';
// import { LogBox } from 'react-native';
import unreadMessagesStore from "./store/unreadMessages";
import {BACKEND_ENDPOINTS, DEBUG} from "./settings";
import client from "./APIClient";
import useJWTStore from "./store/jwt";
import {Platform} from "react-native";

// TODO - This stops the error message that appeared after expo update 50.
// suggest upgrading libraries later on to fix this. Bloody bastard EXPO.
//  https://stackoverflow.com/questions/69538962/new-nativeeventemitter-was-called-with-a-non-null-argument-without-the-requir
// LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
// LogBox.ignoreAllLogs(); //Ignore all log notifications

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

const CALL_BACKEND_PERIODICALLY = 10000;  // 10 seconds

// Set this to false for debugging backend otherwise this will call when ipdb is active.
const GET_UNREAD_MESSAGES_PERIODICALLY = true;

export default function App() {
  const jwt = useJWTStore((state) => state.object);
  const addUnReadMessage = unreadMessagesStore((state) => state.addList);

  useEffect(() => {
    const fetchData = async () => {
      const params = {
        resource: BACKEND_ENDPOINTS.rooms_with_unread_messages,
        successCallback: json => {
          if (json.rooms.length) {
            addUnReadMessage(json.rooms)
          }
        },
        errorCallback: json => {
          DEBUG && console.log("ERROR calling rooms_with_unread_messages:", json);
        },
      }
      if (jwt && GET_UNREAD_MESSAGES_PERIODICALLY) {
        DEBUG && console.log("calling rooms_with_unread_messages");
        await client.get(params);
      }
    };
    fetchData();  // Initial fetch.
    const intervalId = setInterval(fetchData, CALL_BACKEND_PERIODICALLY);
    return () => clearInterval(intervalId);
  }, [jwt]);

  return (
    <ThemeProvider theme={darkTheme}>
      <IconComponentProvider IconComponent={MaterialCommunityIcons}>
        <Navigation />
      </IconComponentProvider>
    </ThemeProvider>
  )
}
