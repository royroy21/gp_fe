import {Pressable, StyleSheet, View} from "react-native";
import {Text} from "@react-native-material/core";
import Image from "../Image/Image";
import useUserStore from "../../store/user";

function UserProfileLink({user, title="user", navigation, theme, containerStyle={}}) {
  const {object} = useUserStore();
  const navigateToOwner = () => {
    navigation.navigate("OtherUser", {user: user});
  }
  const navigateToProfile = () => {
    navigation.navigate("ProfilePage");
  }
  const onPress = object.id === user.id ? navigateToProfile : navigateToOwner;
  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: theme.palette.background.main,
        ...styles.container,
        ...containerStyle,
      }}
    >
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.username}>{user.username}</Text>
      </View>
      <Image
        imageUri={user.image}
        thumbnailUri={user.thumbnail}
        smallerThumbnail={true}
        withModalViewOnPress={false}
        onThumbnailPress={onPress}
        containerStyle={styles.trailingImage}
      />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    paddingTop: 5,
    paddingLeft: 12,
    paddingRight: 12,
    paddingBottom: 5,
    marginLeft: 5,
    marginRight: 5,
    width: "98%"
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
  username: {
    fontSize: 16,
    width: "90%",
  },
  trailingImage: {
    marginLeft: "auto",
  },
})

export default UserProfileLink;
