import {Pressable, StyleSheet, View} from "react-native";
import {Text} from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";

function GigRepliesButton({gig, navigation, theme, containerStyle={}}) {
  const onPress = () => {
    navigation.push("RoomsScreen", {"gigId": gig.id, "gigTitle": gig.title})
  }

  return (
    <View style={styles.outerContainer}>
      <Pressable
        onPress={onPress}
        style={{
          backgroundColor: theme.palette.background.main,
          ...styles.container,
          ...containerStyle,
        }}
      >
        <View style={styles.textContainer}>
          <Text style={styles.title}>{"replies"}</Text>
          <Text style={{...styles.numberOfReplies, color: theme.palette.secondary.main}}>{gig.replies}</Text>
        </View>
        <Icon
          onPress={onPress}
          name={"speaker-wireless"}
          size={25}
          color={"orange"}
          style={styles.icon}
        />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  outerContainer: {
    height: 60,
  },
  container: {
    flex: 1,
    flexDirection: "row",
    paddingTop: 5,
    paddingLeft: 12,
    paddingRight: 5,
    paddingBottom: 5,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 15,
  },
  title: {
    fontSize: 12,
    width: 100,
    color: "gray",
  },
  textContainer: {
    flex: 1,
    flexDirection: "column",
    width: "80%",
  },
  numberOfReplies: {
    fontSize: 16,
    width: "90%",
  },
  icon: {
    paddingTop: 7,
    marginRight: 5,
  },
})

export default GigRepliesButton;
