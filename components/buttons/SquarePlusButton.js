import {Button} from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import {StyleSheet, View} from "react-native";
import TextFieldWithTitle from "../fields/TextFieldWithTitle";

function Content({action, style}) {
  return (
    <Button
      style={{
        ...contentStyles.button,
        ...style,
      }}
      title={
        <Icon
          name={"plus"}
          size={30}
        />
      }
      onPress={action}
    />
  )
}

const contentStyles = StyleSheet.create({
  button: {
    width: 65,
  },
});

function SquarePlusButton({action, title=null, style={}}) {
  if (title) {
    return (
      <>
        <TextFieldWithTitle title={title} />
        <Content action={action} style={style} />
      </>
    )
  }
  return (
    <Content action={action} style={style} />
  )
}

export default SquarePlusButton;
