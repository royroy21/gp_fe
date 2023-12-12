import {View} from "react-native";
import useAlbumsStore from "../../store/albums";
import {useFocusEffect} from "@react-navigation/native";
import React, {useCallback} from "react";
import LoadingModal from "../loading/LoadingModal";
import ListAlbums from "./ListAlbums";

function ShowAlbums(props) {
  const {
    resourceId,  // resourceId can be a gig or profile.
    type,  // type must be one of "gig" or "profile".
    theme,
    navigation,
  } = props;

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
    }, [])
  );

  return (
    <View>
      <LoadingModal isLoading={loadingAlbums} debugMessage={"from @ShowAlbums"}/>
      <ListAlbums
        albums={albums}
        navigation={navigation}
        theme={theme}
      />
    </View>
  )
}

export default ShowAlbums;
