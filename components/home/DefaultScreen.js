import {StyleSheet, Text, View} from "react-native";
import {Button} from "@react-native-material/core";
import AsyncStorage, {useAsyncStorage} from "@react-native-async-storage/async-storage";
import client from "../../APIClient";
import {useEffect, useState} from "react";

export default function DefaultScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const { getItem, setItem } = useAsyncStorage('jwt');

  const getUserFromStorage = async () => {
    // isMounted stops this:  Can't perform a React state update on an unmounted component.
    // https://bobbyhadz.com/blog/react-cant-perform-react-state-update-on-unmounted-component
    let isMounted = true;

    const jwt = await getItem();
    if (jwt) {
      const params = {
        resource: "user/me",
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
      navigation.push("LoginScreen");
    }
    return () => {
      isMounted = false;
    };
  };

  useEffect(() => {getUserFromStorage()}, []);

  const logOut = async () => {
    setUser(null);
    await AsyncStorage.clear();
    navigation.navigate("LoginScreen");
  }

  return (
    <View style={styles.container}>
      <Text>{user ? `Welcome ${user.username}` : "waiting..."}</Text>
      <Button
        title="Login Out"
        onPress={logOut}
      />
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
