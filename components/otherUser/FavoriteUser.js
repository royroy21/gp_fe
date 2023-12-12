import useUserStore from "../../store/user";
import useOtherUserStore from "../../store/otherUser";
import BaseFavourite from "../Favourite/index/BaseFavourite";
import useUsersStore from "../../store/users";

function FavoriteUser({ navigation, user, isFavorite, theme }) {
  const addFavorite = useUserStore((state) => state.addFavorite);
  const removeFavorite = useUserStore((state) => state.removeFavorite);

  const get = useOtherUserStore((state) => state.get);
  const store = useOtherUserStore((state) => state.store);

  const getUsers = useUsersStore((state) => state.get);
  const lastUsersURL = useUsersStore((state) => state.lastURL);

  const onPress = async () => {
    if (isFavorite) {
      await removeFavorite(user.id, onSuccess);
    } else {
      await addFavorite(user.id, onSuccess);
    }
  }

  const onSuccess = async () => {
    if (lastUsersURL) {
      getUsers(lastUsersURL, [], true);
    }
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
