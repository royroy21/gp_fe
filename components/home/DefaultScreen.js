import {StyleSheet, View} from "react-native";
import React, {useEffect} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ShowGigs from "../gig/ShowGigs";
import useUserStore from "../../store/user";
import useJWTStore from "../../store/jwt";
import {Text, useTheme} from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

export default function DefaultScreen({navigation}) {
  const theme = useTheme();

  const { object: user, me, loading: loadingUser } = useUserStore();
  const { object: jwt, loading: loadingJWT, setExisting } = useJWTStore()

  const getUserAndSetJWT = async () => {
    if (!user) {
      const unparsedJWT  = await AsyncStorage.getItem("jwt");
      if (!unparsedJWT) {
        navigation.navigate("LoginScreen");
        return null;
      }
      setExisting(unparsedJWT);
      await me();
    }
    if (!jwt) {
      const unparsedJWT  = await AsyncStorage.getItem("jwt");
      setExisting(unparsedJWT);
    }
  }

  useEffect(() => {getUserAndSetJWT()}, []);
  return (
    <View style={styles.container}>
      {user ? (
        <ShowGigs navigation={navigation} />
      ) : (
        !loadingUser && !loadingJWT ? (
          <View style={styles.pleaseLogInMessage}>
            <Text>{"please log in "}</Text>
            <Icon name="emoticon-happy" size={25} color={theme.palette.secondary.main}/>
          </View>
          ) : null
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  pleaseLogInMessage: {
    height: "100%",
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  }
});
