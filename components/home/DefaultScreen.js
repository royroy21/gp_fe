import {StyleSheet, Text, View} from "react-native";
import {useAsyncStorage} from "@react-native-async-storage/async-storage";
import client from "../../APIClient";
import {useContext, useEffect} from "react";
import {UserContext} from "../context/user";
import {BACKEND_ENDPOINTS, LOGIN_REQUIRED} from "../../settings";
import updateLocation from "../location/updateLocation";

export default function DefaultScreen(props) {
  // This is the first screen a user is directed to. It is responsible
  // for getting user's profile and updating their location to the server.

  const { user, setUser } = useContext(UserContext);
  const { getItem: getJWT } = useAsyncStorage("jwt");

  const getUser = async () => {
    // isMounted stops this:  Can't perform a React state update on an unmounted component.
    // https://bobbyhadz.com/blog/react-cant-perform-react-state-update-on-unmounted-component
    let isMounted = true;

    const jwt = await getJWT();
    if (jwt) {
      const params = {
        resource: BACKEND_ENDPOINTS.me,
        jwt: JSON.parse(jwt).access,
        successCallback: (json) => {
          setUser(json)
          updateLocation(json.id, jwt);
        },
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
