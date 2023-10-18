import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import useGigStore from "../../store/gig";
import {ListItem, Text} from "@react-native-material/core";

function FavoriteGig({navigation, gig, isFavorite}) {
  const {get, addFavorite, removeFavorite} = useGigStore();

  const onPress = async () => {
    if (isFavorite) {
      await removeFavorite(gig.id, onSuccess);
    } else {
      await addFavorite(gig.id, onSuccess);
    }
  }

  const onSuccess = async () => {
    await get(gig.id, navigateToGig);
  }

  const navigateToGig = (data) => {
    navigation.navigate("GigDetail", {gig: data})
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

export default FavoriteGig;
