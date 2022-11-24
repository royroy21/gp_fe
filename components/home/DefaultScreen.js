import {StyleSheet, Text, View} from "react-native";
import {useAsyncStorage} from "@react-native-async-storage/async-storage";
import client from "../../APIClient";
import {useContext, useEffect, useState} from "react";
import {UserContext} from "../context/user";
import {BACKEND_ENDPOINTS, LOGIN_REQUIRED} from "../../settings";
import * as Location from 'expo-location';

export default function DefaultScreen(props) {
  const { user, setUser } = useContext(UserContext);
  const { getItem: getJWT } = useAsyncStorage("jwt");

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      console.log("@location success: ", location);
      const locationReversed = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      console.log("@location reversed: ", locationReversed);
      setLocation(location);
    })();
  }, []);

  const getUser = async () => {
    // isMounted stops this:  Can't perform a React state update on an unmounted component.
    // https://bobbyhadz.com/blog/react-cant-perform-react-state-update-on-unmounted-component
    let isMounted = true;

    const jwt = await getJWT();
    if (jwt) {
      const params = {
        resource: BACKEND_ENDPOINTS.me,
        jwt: JSON.parse(jwt).access,
        successCallback: setUser,
        // TODO - handle error.
        // Probably token is out of date so implement refresh token logic here.
        errorCallback: (json) => console.log("error @ user/me: ", JSON.stringify(json)),
      }
      if (isMounted) {
        await client.get(params);
      }
    } else {
      if (LOGIN_REQUIRED) {
        props.navigation.push("LoginScreen");
      }
    }
    return () => {
      isMounted = false;
    };
  };

  useEffect(() => {getUser()}, []);
  return (
    <View style={styles.container}>
      <Text>{user ? `Welcome ${user.username}` : "not logged in :("}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  }
});
