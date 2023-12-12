import React from "react";
import {Platform, StyleSheet, View} from "react-native";
import ShowGigs from "../gig/ShowGigs";
import useUserStore from "../../store/user";
import useJWTStore from "../../store/jwt";
import {useTheme} from "@react-native-material/core";
import RegisterNotifications from "../notifications";
import PleaseLoginMessage from "../loginSignUp/PleaseLoginMessage";

export default function DefaultScreen({ navigation, route }) {
  const theme = useTheme();
  const isWeb = Boolean(Platform.OS === "web");

  const user = useUserStore((state) => state.object);
  const loadingUser = useUserStore((state) => state.loading);
  const loadingJWT = useJWTStore((state) => state.loading);

  if (isWeb) {
    return (
      <View style={styles.container}>
        <ShowGigs
          navigation={navigation}
          route={route}
        />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* RegisterNotifications is fine to live here at the moment as notifications are only for mobile */}
      <RegisterNotifications navigation={navigation} />
      {user ? (
        <ShowGigs
          navigation={navigation}
          route={route}
        />
      ) : (
        !loadingUser && !loadingJWT ? (
          <PleaseLoginMessage theme={theme} />
          ) : null
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
