import useGigStore from "../../store/gig";
import BaseFavourite from "../Favourite/index/BaseFavourite";
import useGigsStore from "../../store/gigs";

function FavoriteGig({navigation, gig, isFavorite, theme}) {
  const get = useGigStore((state) => state.get);
  const addFavorite = useGigStore((state) => state.addFavorite);
  const removeFavorite = useGigStore((state) => state.removeFavorite);
  const storeGig = useGigStore((state) => state.store);

  const getGigs = useGigsStore((state) => state.get);
  const lastGigsURL = useGigsStore((state) => state.lastURL);

  const onPress = async () => {
    if (isFavorite) {
      await removeFavorite(gig.id, onSuccess);
    } else {
      await addFavorite(gig.id, onSuccess);
    }
  }

  const onSuccess = async () => {
    if (lastGigsURL) {
      getGigs(lastGigsURL, [], true);
    }
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
