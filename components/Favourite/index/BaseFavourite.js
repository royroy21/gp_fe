import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import {Text} from "@react-native-material/core";
import {Pressable, StyleSheet, View} from "react-native";

function BaseFavourite({ onPress, isFavorite, theme }) {
  return (
    <View style={styles.outerContainer}>
      <Pressable
        onPress={onPress}
        style={{
          backgroundColor: theme.palette.background.main,
          ...styles.container,
        }}
      >
        <View style={styles.textContainer}>
          <Text style={styles.title}>{isFavorite ? "un-favorite" : "favorite"}</Text>
        </View>
        <Icon
          style={{paddingTop: 5}}
          name="star"
          size={25}
          color={isFavorite ? "orange" : "grey"}
          onPress={onPress}
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
    paddingRight: 12,
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 15,
    width: "98%",
    borderRadius: 15,
  },
  title: {
    paddingTop: 8,
    width: 100,
    color: "gray",
  },
  textContainer: {
    flex: 1,
    flexDirection: "column",
    width: "80%",
  },
})

export default BaseFavourite;
