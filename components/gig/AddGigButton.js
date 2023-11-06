import {StyleSheet} from "react-native";
import {IconButton} from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";

function AddGigButton({ navigation, theme }) {
  const color = theme.palette.secondary.main;
  return (
    <IconButton
      style={{
        ...styles.button,
        backgroundColor: "gray",
        borderColor: color,
      }}
      onPress={() => navigation.navigate("AddGig")}
      icon={
        <Icon
          name={"plus"}
          size={40}
          color={theme.palette.background.main}
        />
      }
    />
  )
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    bottom: 20,
    right: 20,
  }
});

export default AddGigButton;
