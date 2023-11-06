import {StyleSheet, View} from "react-native";
import {Text} from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";

function PleaseLoginMessage({ theme }) {
  return (
    <View style={styles.container}>
      <Text>{"please log in "}</Text>
      <Icon
        name={"emoticon-happy"}
        size={25}
        color={theme.palette.secondary.main}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  }
});

export default PleaseLoginMessage;
