import {StyleSheet} from "react-native";
import useAlbumsStore from "../../store/albums";
import {useFocusEffect} from "@react-navigation/native";
import React, {useCallback} from "react";
import ListAlbums from "./ListAlbums";
import {useTheme} from "@react-native-material/core";
import LoadingModal from "../loading/LoadingModal";
import SquarePlusButton from "../buttons/SquarePlusButton";

function AddMusic({navigation, route}) {
  const theme = useTheme()

  const {
    resourceId,  // resourceId can be for gig or profile.
    type,  // type must be one of "gig" or "profile".
  } = route.params;

  const albums = useAlbumsStore((state) => state.object);
  const getAlbums = useAlbumsStore((state) => state.get);
  const loadingAlbums = useAlbumsStore((state) => state.loading);
  const clearAlbums = useAlbumsStore((state) => state.clear);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      if (!isActive) {
        return
      }

      getAlbums(`?${type}_id=${resourceId}`);
      return () => {
        isActive = false;
        clearAlbums();
      };
    }, [type, resourceId])
  );

  const navigateToAddAlbum = () => {
    navigation.push("AddAlbum", {resourceId: resourceId, type: type});
  }

  return (
    <>
      <LoadingModal isLoading={loadingAlbums} debugMessage={"from @AddMusic"}/>
      <ListAlbums
        albums={albums}
        showAlbumsWithoutTracks={true}
        navigation={navigation}
        theme={theme}
      />
      <SquarePlusButton
        action={navigateToAddAlbum}
        title={"Add Album"}
        style={styles.navigateToAddMusic}
      />
    </>
  )
}

const styles = StyleSheet.create({
  navigateToAddMusic: {
    marginLeft: 16,
  },
});

export default AddMusic;
