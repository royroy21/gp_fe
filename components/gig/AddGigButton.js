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
          backgroundColor: theme.palette.background.main,
          borderColor: color,
        }}
        onPress={() => navigation.navigate("AddGig")}
        icon={
          <Icon
            name={"plus"}
            size={30}
            color={color}
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
    borderWidth: 1,
    borderStyle: "solid",
  }
});

export default AddGigButton;
