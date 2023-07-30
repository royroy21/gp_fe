import {useEffect, useRef} from "react";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import {Platform} from "react-native";
import {BACKEND_ENDPOINTS, EXPO_PROJECT_ID} from "../../settings";
import client from "../../APIClient";
import AsyncStorage, {useAsyncStorage} from "@react-native-async-storage/async-storage";
import {useNavigationState} from "@react-navigation/native";

export const registerForPushNotifications = async (userId) => {
  if (!Device.isDevice) {
    // Not a mobile device.
    return;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      // lightColor: "#FF231F7C",
    });
  }
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    const token  = await AsyncStorage.getItem("notificationToken");
    if (token) {
      await postNotificationToken(userId, token, false);
    }
    return;
  }
  const options = {
    projectId: EXPO_PROJECT_ID,  // expo projectId
  }
  const token = (await Notifications.getExpoPushTokenAsync(options)).data;
  // The reason this token is stored is so that
  // if permission is changed in the future the
  // token can be re-sent to the server as inactive.
  const { setItem } = useAsyncStorage("notificationToken");
  await setItem(token);
  await postNotificationToken(userId, token, true);
}

async function postNotificationToken(userId, token, active) {
  /*
  Post notification token to server.
   */
  const params = {
    resource: `${BACKEND_ENDPOINTS.user}${userId}/notification-token/`,
    successCallback: () => console.log("Successfully posted notification token."),
    // TODO - Log this as sentry?
    errorCallback: (json) => console.log("error @postNotificationToken: ", JSON.stringify(json)),
    data: {token, active},
  }
  await client.post(params);
}

const getRoomIdFromRouteParams = (routeParams) => {
  if (!routeParams) {
    return null
  }
  return routeParams.room ? routeParams.room.id : null;
}

const NotificationClickedOnBehaviour = {
  // What to do if a notification is clicked
  // on based upon received data type.
  // For example navigate to a screen.
  "room": (navigation, data) => {
    navigation.navigate("Room", {room: data.serialized_object});
  }
}

function RegisterNotifications({ navigation }) {
  useNavigationState(state => {
    const {name, params} = state.routes[state.index];
    Notifications.setNotificationHandler({
      handleNotification: async (notification) => {
        const {data} = notification.request.content;
        const {id: roomID} = data.serialized_object;
        // If the user is already on the received message
        // room screen do not display a push notification.
        if (name === "Room" && getRoomIdFromRouteParams(params) === roomID) {
          return null;
        }
        return {
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        }
      },
    });
  })
  const notificationListener = useRef();
  const responseListener = useRef();
  useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      // Do something when message is received. At the moment nothing is done.
    });
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      // Do something when message is clicked on.
      const {data} = response.notification.request.content;
      NotificationClickedOnBehaviour[data.type](navigation, data);
    });
    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
  return null
}

export default RegisterNotifications;
