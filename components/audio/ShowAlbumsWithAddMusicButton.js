import {StyleSheet, View} from "react-native";
import useAlbumsStore from "../../store/albums";
import {useFocusEffect} from "@react-navigation/native";
import React, {useCallback} from "react";
import LoadingModal from "../loading/LoadingModal";
import ListAlbums from "./ListAlbums";
import SquarePlusButton from "../buttons/SquarePlusButton";

function ShowAlbumsWithAddMusicButton(props) {
  const {
    resourceId,  // resourceId can be a gig or profile.
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

  const navigateToAddMusic = () => {
    navigation.push("AddMusic", {resourceId: resourceId, type: type});
  }

  return (
    <View>
      <LoadingModal isLoading={loadingAlbums} debugMessage={"from @ShowAlbumsWithAddMusicButton"}/>
      <ListAlbums
        albums={albums}
        navigation={navigation}
        theme={theme}
      />
      <SquarePlusButton
        action={navigateToAddMusic}
        title={"Add music"}
        theme={theme}
        style={styles.navigateToAddMusic}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  navigateToAddMusic: {
    marginLeft: 16,
  },
});


export default ShowAlbumsWithAddMusicButton;
