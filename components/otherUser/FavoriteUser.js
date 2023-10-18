import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import useUserStore from "../../store/user";
import useOtherUserStore from "../../store/otherUser";
import {ListItem, Text} from "@react-native-material/core";

function FavoriteUser({navigation, user, isFavorite}) {
  const {addFavorite, removeFavorite} = useUserStore();
  const {get} = useOtherUserStore();

  const onPress = async () => {
    if (isFavorite) {
      await removeFavorite(user.id, onSuccess);
    } else {
      await addFavorite(user.id, onSuccess);
    }
  }

  const onSuccess = async () => {
    await get(user.id, navigateToOtherUser);
  }

  const navigateToOtherUser = (data) => {
    navigation.navigate("OtherUser", {user: data})
  }

  return (
    <ListItem
      title={<Text style={{color: "grey"}}>{isFavorite ? "un-favorite" : "favorite"}</Text>}
      onPress={onPress}
      trailing={
        <Icon
          name="star"
          size={25}
          color={isFavorite ? "orange" : "grey"}
          onPress={onPress}
        />
      }
    />
  )
}

export default FavoriteUser;
