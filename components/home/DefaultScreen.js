import React from "react";
import {Platform, StyleSheet, View} from "react-native";
import ShowGigs from "../gig/ShowGigs";
import RegisterNotifications from "../notifications";
import {USE_PUSH_NOTIFICATIONS} from "../../settings";

export default function DefaultScreen({ navigation, route }) {
  const isWeb = Boolean(Platform.OS === "web");

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
      {USE_PUSH_NOTIFICATIONS && <RegisterNotifications navigation={navigation} />}
        <ShowGigs
          navigation={navigation}
          route={route}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
