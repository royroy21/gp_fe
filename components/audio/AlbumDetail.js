import CustomScrollViewWithOneButton from "../views/CustomScrollViewWithOneButton";
import {StyleSheet, View} from "react-native";
import Image from "../Image/Image";
import DisplayGenres from "../gig/DisplayGenres";
import TextFieldWithTitle from "../fields/TextFieldWithTitle";
import useUserStore from "../../store/user";
import CustomScrollViewWithTwoButtons from "../views/CustomScrollViewWithTwoButtons";
import React, {useCallback, useState} from "react";
import useAlbumStore from "../../store/album";
import LoadingModal from "../loading/LoadingModal";
import ShowTracks from "./ShowTracks";
import SquarePlusButton from "../buttons/SquarePlusButton";
import {useFocusEffect, useIsFocused} from "@react-navigation/native";
import DeleteModal from "../delete/DeleteModal";

function AlbumDetailContent({ album, isOwner }) {
  return (
    <>
      <View style={AlbumDetailContentStyles.imageAndGenresContainer}>
        <Image
          imageUri={album.image}
          thumbnailUri={album.thumbnail}
          containerStyle={AlbumDetailContentStyles.image}
        />
        <DisplayGenres
          genres={album.genres}
          containerStyle={AlbumDetailContentStyles.genres}
        />
      </View>
      {isOwner && album.is_default ? (
        <TextFieldWithTitle
          title={"Default album. Cannot be deleted."}
          text={""}
        />
      ) : null}
      <TextFieldWithTitle
        title={"title"}
        text={album.title}
      />
      {album.description ? (
        <TextFieldWithTitle
          title={"description"}
          text={album.description}
        />
      ) : null}
      {album.tracks.length ? (
        <ShowTracks tracks={album.tracks} />
      ) : null}
    </>
  )
}

function AlbumDetailIfOwner(props) {
  const {
    album,
    deleteAlbumModal,
    setDeleteAlbumModal,
    deleteAlbumAction,
    isOwner,
  } = props;
  return (
    <>
      <DeleteModal
        showModal={deleteAlbumModal}
        setModal={setDeleteAlbumModal}
        action={deleteAlbumAction}
      />
      <AlbumDetailContent
        album={album}
        isOwner={isOwner}
      />
    </>
  )
}

const AlbumDetailContentStyles = StyleSheet.create({
  imageAndGenresContainer: {
    flexDirection: "row"
  },
  image: {
    margin: 10,
  },
  genres: {
    width: "65%",
    alignItems: "flex-end",
  },
})

function AlbumDetail({ navigation, route }) {
  const isFocused = useIsFocused();
  const { id, refresh } = route.params;
  const {
    object: album,
    store,
    get: getAlbum,
    delete: deleteAlbum,
    loading,
  } = useAlbumStore();
  const [albumInState, setAlbumInState] = useState(refresh ? null : album);

  const correctAlbumInState = () => {
    const formattedAlbum = albumInState || {id: null};
    return formattedAlbum.id === id;
  }

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      if (!isActive) {
        return
      }
      if (!correctAlbumInState()) {
        getAlbum(id, setAlbumInState);
      }
      return () => {
        isActive = false;
      };
    }, [id])
  );

  if (!isFocused) {
    return null
  }

  if (!correctAlbumInState()) {
    return (
      <LoadingModal
        isLoading={loading}
        debugMessage={"from @AlbumDetail 1"}
      />
    )
  }

  return (
    <InnerAlbumDetail
      album={albumInState}
      store={store}
      setAlbumInState={setAlbumInState}
      deleteAlbum={deleteAlbum}
      loading={loading}
      navigation={navigation}
    />
  )

}

function InnerAlbumDetail({ album, store, deleteAlbum, loading, navigation }) {
  // Album here could be an object or ID depending on if
  // coming from AddTrack (object) or EditTrack (ID) or other.
  // If album is ID we get fetch the object from BE database.
  const { object: user } = useUserStore();
  const [deleteAlbumModal, setDeleteAlbumModal] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setDeleteAlbumModal(false);
      };
    }, [])
  );

  const getIsOwner = () => {
    if (!user) {
      return false
    }
    return user.id === album.user.id;
  }
  const isOwner = getIsOwner();

  if (!isOwner) {
    return (
      <CustomScrollViewWithOneButton>
        <AlbumDetailContent album={album} isOwner={isOwner} />
      </CustomScrollViewWithOneButton>
    )
  }

  const edit = () => {
    store(album);
    navigation.push("EditAlbum", {id: album.id});
  }

  const onSuccess = () => {
    const params = album.gig
      ? {resourceId: album.gig.id, type: "gig"}
      : {resourceId: album.profile.id, type: "profile"}
    navigation.push("AddMusic", params);
  }

  const deleteAlbumAction = () => {
    setDeleteAlbumModal(false);
    deleteAlbum(album.id, onSuccess);
  }

  const openDeleteAlbumModal = () => {
    setDeleteAlbumModal(true)
  }

  const navigateToAddTrack = () => {
    store(album);
    navigation.push("AddTrack", {albumId: album.id});
  }

  if (album.is_default) {
    // Delete button is removed for default album.
    return (
      <CustomScrollViewWithOneButton
        buttonTitle={"edit"}
        buttonOnPress={edit}
      >
        <AlbumDetailIfOwner
          album={album}
          loading={loading}
          deleteAlbumModal={deleteAlbumModal}
          setDeleteAlbumModal={setDeleteAlbumModal}
          deleteAlbumAction={deleteAlbumAction}
          isOwner={isOwner}
        />
        <SquarePlusButton
          action={navigateToAddTrack}
          title={"Add track"}
          style={AlbumDetailStyles.navigateToAddMusic}
        />
      </CustomScrollViewWithOneButton>
    )
  }

  return (
    <CustomScrollViewWithTwoButtons
      actionButton1Title={"edit"}
      actionButton1OnPress={edit}
      actionButton2Title={"delete"}
      actionButton2OnPress={openDeleteAlbumModal}
    >
      <AlbumDetailIfOwner
        album={album}
        deleteAlbumModal={deleteAlbumModal}
        setDeleteAlbumModal={setDeleteAlbumModal}
        deleteAlbumAction={deleteAlbumAction}
        isOwner={isOwner}
      />
      <SquarePlusButton
        action={navigateToAddTrack}
        title={"Add track"}
        style={AlbumDetailStyles.navigateToAddMusic}
      />
    </CustomScrollViewWithTwoButtons>
  )
}

const AlbumDetailStyles = StyleSheet.create({
  addTrackButton: {
    width: 120,
    margin: 15,
  },
  navigateToAddMusic: {
    marginLeft: 16,
  },
})

export default AlbumDetail;
