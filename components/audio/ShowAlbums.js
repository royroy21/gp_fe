import {View} from "react-native";
import useAlbumsStore from "../../store/albums";
import {useFocusEffect} from "@react-navigation/native";
import React, {useCallback} from "react";
import LoadingModal from "../loading/LoadingModal";
import ListAlbums from "./ListAlbums";

function ShowAlbums(props) {
  const {
    resource,  // resource can be a gig or profile object.
    type,  // type must be one of "gig" or "profile".
    theme,
    navigation,
  } = props;

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

  return (
    <View>
      <LoadingModal isLoading={loadingAlbums} />
      <ListAlbums
        albums={albums}
        navigation={navigation}
        theme={theme}
      />
    </View>
  )
}

export default ShowAlbums;
