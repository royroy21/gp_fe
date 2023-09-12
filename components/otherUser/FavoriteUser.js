import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import useUserStore from "../../store/user";
import useOtherUserStore from "../../store/otherUser";

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
    <Icon
      onPress={onPress}
      name={"star"}
      size={25}
      color={isFavorite ? "orange" : "grey"}
    />
  )
}

export default FavoriteUser;
