import useUserStore from "../../store/user";
import useOtherUserStore from "../../store/otherUser";
import BaseFavourite from "../Favourite/index/BaseFavourite";

function FavoriteUser({ navigation, user, isFavorite, theme }) {
  const {addFavorite, removeFavorite} = useUserStore();
  const { store, get } = useOtherUserStore();

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
    store(data);
    navigation.push("OtherUser", {id: data.id})
  }

  return (
    <BaseFavourite
      onPress={onPress}
      isFavorite={isFavorite}
      theme={theme}
    />
  )
}

export default FavoriteUser;
