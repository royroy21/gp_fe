import {Pressable, StyleSheet, View} from "react-native";
import {Text} from "@react-native-material/core";
import Image from "../Image/Image";
import useUserStore from "../../store/user";
import useOtherUserStore from "../../store/otherUser";

function UserProfileLink({user, title="user", navigation, theme, containerStyle={}}) {
  const object = useUserStore((state) => state.object);
  const storeOtherUser = useOtherUserStore((state) => state.store);
  const thisUser = object || {id: null};

  const navigateToOwner = () => {
    storeOtherUser(user);
    navigation.push("OtherUser", {id: user.id});
  }

  const navigateToProfile = () => {
    navigation.push("ProfilePage");
  }

  const onPress = thisUser.id === user.id ? navigateToProfile : navigateToOwner;

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
        thumbnailStyle={styles.thumbnailStyle}
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
  username: {
    fontSize: 16,
    width: "90%",
  },
  trailingImage: {
    marginLeft: "auto",
    marginRight: 5,
  },
  thumbnailStyle: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
})

export default UserProfileLink;
