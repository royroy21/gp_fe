import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import {Text} from "@react-native-material/core";
import {Pressable, StyleSheet, View} from "react-native";

function ActiveUserGigsButton({ user, navigation, theme }) {
  if (!user.number_of_active_gigs) {
    return null;
  }
  const onPress = () => {
    navigation.push("DefaultScreen", {userId: user.id, userName: user.username});
  }
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
          <Text style={styles.title}>
            {`${user.number_of_active_gigs} active ${user.number_of_active_gigs === 1 ? "gig" : "gigs"}`}
          </Text>
        </View>
        <Icon
          style={{paddingTop: 5, paddingRight: 5}}
          name="music"
          size={25}
          color={theme.palette.secondary.main}
          onPress={onPress}
        />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  outerContainer: {
    marginTop: 10,
    height: 60,
  },
  container: {
    flex: 1,
    flexDirection: "row",
    paddingTop: 5,
    paddingLeft: 12,
    paddingRight: 5,
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 15,
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

export default ActiveUserGigsButton;
