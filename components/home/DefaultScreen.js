import {Text, View} from "react-native";
import {Button} from "@react-native-material/core";
import AsyncStorage, {useAsyncStorage} from "@react-native-async-storage/async-storage";
import client from "../../APIClient";
import {useEffect, useState} from "react";

export default function DefaultScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const { getItem, setItem } = useAsyncStorage('jwt');

  useEffect(() => {getUserFromStorage()}, []);

  const getUserFromStorage = async () => {
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
      client.get(params);
    } else {
      navigation.navigate("LoginScreen");
    }
  };

  const logOut = () => {
    AsyncStorage.clear();
    navigation.navigate('LoginScreen')
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>{user ? `Welcome ${user.username}` : "waiting..."}</Text>
      <Button
        title="Login Out"
        onPress={logOut}
      />
    </View>
  );
}
