import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import useGigStore from "../../store/gig";
import {Text} from "@react-native-material/core";
import {Pressable, StyleSheet, View} from "react-native";
import BaseFavourite from "../Favourite/index/BaseFavourite";

function FavoriteGig({navigation, gig, isFavorite, theme}) {
  const {get, addFavorite, removeFavorite} = useGigStore();
  const {
    store: storeGig,
  } = useGigStore();

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
    storeGig(data);
    navigation.push("GigDetail", {id: data.id})
  }

  return (
    <BaseFavourite
      onPress={onPress}
      isFavorite={isFavorite}
      theme={theme}
    />
  )
}

export default FavoriteGig;
