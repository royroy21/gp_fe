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
    resource,  // resource can be a gig or profile object.
    type,  // type must be one of "gig" or "profile".
  } = route.params;

  const {
    get: getAlbums,
    loading: loadingAlbums,
    object: albums,
    clear: clearAlbums,
  }= useAlbumsStore();

  useFocusEffect(
    useCallback(() => {
      getAlbums(`?${type}_id=${resource.id}`);
      return () => {
        clearAlbums();
      };
    }, [])
  );

  const navigateToAddAlbum = () => {
    navigation.navigate("AddAlbum", {resource: resource, type: type});
  }

  return (
    <>
      <LoadingModal isLoading={loadingAlbums} />
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
