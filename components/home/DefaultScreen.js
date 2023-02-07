import {StyleSheet, Text, View} from "react-native";
import {useContext, useEffect} from "react";
import {UserContext} from "../context/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useNavigation} from "@react-navigation/native";
import getUserFromBackend from "../../helpers/getUserFromBackend";

export default function DefaultScreen() {
  const navigation = useNavigation();
  const { user, setUser } = useContext(UserContext);

  const getUser = async () => {
    if (!user) {
      const unparsedJWT  = await AsyncStorage.getItem("jwt");
      if (!unparsedJWT) {
        navigation.navigate("LoginScreen");
        return null;
      }
      const jwt = JSON.parse(unparsedJWT);
      await getUserFromBackend(jwt, setUser);
    }
  }

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
