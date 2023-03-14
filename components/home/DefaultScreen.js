import {StyleSheet, Text, View} from "react-native";
import {useEffect} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ShowGigs from "../gig/ShowGigs";
import useUserStore from "../../store/user";

export default function DefaultScreen({navigation}) {
  const { object: user, me } = useUserStore();

  const getUser = async () => {
    if (!user) {
      const unparsedJWT  = await AsyncStorage.getItem("jwt");
      if (!unparsedJWT) {
        navigation.navigate("LoginScreen");
        return null;
      }
      await me();
    }
  }

  useEffect(() => {getUser()}, []);
  return (
    <View style={styles.container}>
      {user ? (
        <ShowGigs navigation={navigation} />
      ) : (
        <Text>{"please log in :)"}</Text>
      )}
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
