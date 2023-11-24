import {Pressable, StyleSheet, View} from "react-native";
import {Text} from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import {BACKEND_ENDPOINTS} from "../../settings";
import React from "react";

function GigRepliesButton({gig, navigation, theme, containerStyle={}}) {
  const onPress = () => {
    navigation.push("RoomsScreen", {"initialQuery": BACKEND_ENDPOINTS.room + `?gig_id=${gig.id}`})
  }

  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: theme.palette.background.main,
        ...styles.repliesContainer,
        ...containerStyle,
      }}
    >
      <View style={styles.repliesTextContainer}>
        <Text style={styles.repliesTitle}>{"replies"}</Text>
        <Text style={styles.repliesNumberOfReplies}>{gig.replies}</Text>
      </View>
      <Icon
        onPress={onPress}
        name={"speaker-wireless"}
        size={25}
        color={"orange"}
        style={styles.Icon}
      />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  repliesContainer: {
    flex: 1,
    flexDirection: "row",
    paddingTop: 5,
    paddingLeft: 12,
    paddingRight: 12,
    paddingBottom: 5,
    marginLeft: 5,
    marginRight: 5,
    width: "98%",
    borderRadius: 15,
  },
  repliesTitle: {
    fontSize: 12,
    width: 100,
    color: "gray",
  },
  repliesTextContainer: {
    flex: 1,
    flexDirection: "column",
    width: "80%",
  },
  repliesNumberOfReplies: {
    fontSize: 16,
    width: "90%",
  },
  Icon: {
    paddingTop: 5,
  },
})

export default GigRepliesButton;
