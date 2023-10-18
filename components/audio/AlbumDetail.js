import CustomScrollViewWithOneButton from "../views/CustomScrollViewWithOneButton";
import {StyleSheet, View} from "react-native";
import Image from "../Image/Image";
import DisplayGenres from "../gig/DisplayGenres";
import TextFieldWithTitle from "../fields/TextFieldWithTitle";
import useUserStore from "../../store/user";
import CustomScrollViewWithTwoButtons from "../views/CustomScrollViewWithTwoButtons";
import CenteredModalWithTwoButton from "../centeredModal/CenteredModalWithTwoButtons";
import React, {useState} from "react";
import {Button, Text} from "@react-native-material/core";
import useAlbumStore from "../../store/album";
import LoadingModal from "../loading/LoadingModal";
import ShowTracks from "./ShowTracks";
import SquarePlusButton from "../buttons/SquarePlusButton";
import {useFocusEffect} from "@react-navigation/native";

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
      <CenteredModalWithTwoButton
        showModal={deleteAlbumModal}
        setModal={setDeleteAlbumModal}
        actionButton={
          <Button
            style={AlbumDetailStyles.deleteButton}
            title={"delete"}
            onPress={deleteAlbumAction}
          />
        }
      >
        <Text style={AlbumDetailStyles.areYouSureMessage}>{"Are you sure?"}</Text>
      </CenteredModalWithTwoButton>
      <AlbumDetailContent album={album} isOwner={isOwner} />
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

function AlbumDetail({navigation, route}) {
  // Album here could be an object or ID depending on if
  // coming from AddTrack (object) or EditTrack (ID) or other.
  // If album is ID we get fetch the object from BE database.
  const { albumId } = route.params;
  const { object } = useUserStore();
  const {
    object: album,
    get: getAlbum,
    delete: deleteAlbum,
    loading,
    clear,
  } = useAlbumStore();

  const [deleteAlbumModal, setDeleteAlbumModal] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      getAlbum(albumId);
      return () => {
        setDeleteAlbumModal(false);
        clear();
      };
    }, [])
  );

  if (!album || loading) {
    return <LoadingModal isLoading={loading} />
  }

  const isOwner = object.id === album.user.id;

  if (!isOwner) {
    return (
      <CustomScrollViewWithOneButton>
        <AlbumDetailContent album={album} isOwner={isOwner} />
      </CustomScrollViewWithOneButton>
    )
  }

  const edit = () => {
    navigation.navigate("EditAlbum", {album: album});
  }

  const onSuccess = () => {
    const params = album.gig
      ? {resource: album.gig, type: "gig"}
      : {resource: album.profile, type: "profile"}
    navigation.navigate("AddMusic", params);
  }

  const deleteAlbumAction = () => {
    deleteAlbum(album.id, onSuccess);
  }

  const openDeleteAlbumModal = () => {
    setDeleteAlbumModal(true)
  }

  const navigateToAddTrack = () => {
    navigation.navigate("AddTrack", {album: album});
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
  deleteButton: {
    width: 100,
  },
  addTrackButton: {
    width: 120,
    margin: 15,
  },
  areYouSureMessage: {
    width: "100%",
    textAlign: "center",
  },
  navigateToAddMusic: {
    marginLeft: 16,
  },
})

export default AlbumDetail;
