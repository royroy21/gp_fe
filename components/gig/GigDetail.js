import {StyleSheet, View} from "react-native";
import {Chip, Text, useTheme} from "@react-native-material/core";
import DisplayGenres from "./DisplayGenres";
import dateFormat from "dateformat";
import useUserStore from "../../store/user";
import Errors from "../forms/Errors";
import LoadingModal from "../loading/LoadingModal";
import React, {useCallback, useState} from "react";
import newMessage from "../message/newMessage";
import useJWTStore from "../../store/jwt";
import Image from "../Image/Image";
import TextFieldWithTitle from "../fields/TextFieldWithTitle";
import UserProfileLink from "../profile/UserProfileLink";
import CustomScrollViewWithOneButton from "../views/CustomScrollViewWithOneButton";
import FavoriteGig from "./FavoriteGig";
import useGigStore from "../../store/gig";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import {BACKEND_ENDPOINTS, DEBUG} from "../../settings";
import ShowAlbumsWithAddMusicButton from "../audio/ShowAlbumsWithAddMusicButton";
import ShowAlbums from "../audio/ShowAlbums";
import {useFocusEffect, useIsFocused} from "@react-navigation/native";
import useRoomStore from "../../store/room";
import GigRepliesButton from "./GigRepliesButton";
import CustomScrollViewWithTwoButtons from "../views/CustomScrollViewWithTwoButtons";
import DeleteModal from "../delete/DeleteModal";

function GigDetail({ navigation, route }) {
  const isFocused = useIsFocused();
  const { id } = route.params;
  const { object: user } = useUserStore();
  const {object: gig, loading, error, get: getGig, delete: deleteGig } = useGigStore();
  const [gigInState, setGigInState] = useState(gig);

  const correctGigInState = () => {
    const formattedGig = gigInState || {id: null};
    DEBUG && console.log("@GigDetail hits correctGigInState ", formattedGig, id);
    return formattedGig.id === id;
  }

  useFocusEffect(
    useCallback(() => {
      DEBUG && console.log("@GigDetail hits 0");
      let isActive = true;
      if (!isActive) {
        DEBUG && console.log("@GigDetail hits 1 - not active");
        return
      }
      if (!correctGigInState()) {
        DEBUG && console.log("@GigDetail hits 2 - getting gig");
        getGig(id, setGigInState);
      }
      return () => {
        isActive = false;
      };
    }, [id])
  );

  if (!isFocused) {
    DEBUG && console.log("@GigDetail hits 3 - not focused");
    return null
  }

  if (!correctGigInState()) {
    DEBUG && console.log("@GigDetail hits 4 - incorrect gig in state ", gigInState);
    return (
      <LoadingModal
        isLoading={loading}
        debugMessage={"from @GigDetail 1"}
      />
    )
  }

  DEBUG && console.log("@GigDetail hits 5 - display inner");
  return (
    <InnerGigDetail
      user={user}
      gig={gigInState}
      loading={loading}
      error={error}
      deleteGig={deleteGig}
      navigation={navigation}
    />
  )
}

function InnerGigDetail({ user, gig, loading, error, deleteGig, navigation }) {

  const getIsGigOwner = () => {
    if (!user || !gig) {
      return false
    }
    return user.id === gig.user.id;
  }
  const isGigOwner = getIsGigOwner();

  const getBottomMessageText = () => {
    if (!gig.active) {
      return "This gig has been deleted.";
    }
    return !user && "Login to respond"
  }
  const bottomMessageText = getBottomMessageText();

  return (
    <>
    {isGigOwner ? (
      <DetailIfGigOwner
        user={user}
        isGigOwner={isGigOwner}
        gig={gig}
        bottomMessageText={bottomMessageText}
        loading={loading}
        error={error}
        deleteGig={deleteGig}
        navigation={navigation}
      />
      ) : (
      <DetailIfNotGigOwner
        user={user}
        isGigOwner={isGigOwner}
        gig={gig}
        bottomMessageText={bottomMessageText}
        navigation={navigation}
      />
    )}
    </>
  )
}

function DetailIfGigOwner({ user, isGigOwner, gig, loading, error, deleteGig, navigation, bottomMessageText }) {
  const [deleteModal, setDeleteModal] = useState(false);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setDeleteModal(false);
      }
    }, [])
  );

  const edit = () => {
    navigation.push("EditGig", {id: gig.id});
  }

  const onSuccess = () => {
    navigation.navigate("MyGigs");
    return () => {
      setDeleteModal(false);
    };
  }

  const openDeleteModal = () => {
    setDeleteModal(true)
  }

  const deleteGigAction = () => {
    deleteGig(gig.id, onSuccess);
  }

  const parsedError = error || {};
  return (
    <>
      <CustomScrollViewWithTwoButtons
        actionButton1Title={user && gig.active ? "edit" : null}
        actionButton1OnPress={user && gig.active ? edit : null}
        actionButton2Title={user && gig.active ? "delete" : null}
        actionButton2OnPress={user && gig.active ? openDeleteModal : null}
        bottomMessage={bottomMessageText}
      >
        <DeleteModal
          showModal={deleteModal}
          setModal={setDeleteModal}
          action={deleteGigAction}
          error={error}
        />
        {(parsedError.detail) && <Errors errorMessages={parsedError.detail} />}
        {(parsedError.unExpectedError) && <Errors errorMessages={parsedError.unExpectedError} />}
        <LoadingModal isLoading={loading} debugMessage={"from @DetailIfGigOwner 2"} />
        <Detail
          user={user}
          isGigOwner={isGigOwner}
          gig={gig}
          navigation={navigation}
        />
      </CustomScrollViewWithTwoButtons>
  </>
  );
}

function DetailIfNotGigOwner({ user, isGigOwner, gig, navigation, bottomMessageText }) {
  const { store: storeRoom } = useRoomStore();
  const [loadingMessageWS, setLoadingMessageWS] = useState(false);
  const [error, setError] = useState(null);
  const {object: jwt} = useJWTStore();
  const accessToken = jwt ? JSON.parse(jwt).access : null;

  const respond = () => {
    const newMessageArguments = {
      storeRoom: storeRoom,
      navigation: navigation,
      parameters: "?type=gig&gig_id=" + gig.id,
      accessToken: accessToken,
      setLoading: setLoadingMessageWS,
      setError: setError,
    }
    newMessage(newMessageArguments);
  }

  const parsedError = error || {};
  return (
    <>
      {(parsedError.detail) && <Errors errorMessages={parsedError.detail} />}
      {(parsedError.unExpectedError) && <Errors errorMessages={parsedError.unExpectedError} />}
      <LoadingModal isLoading={loadingMessageWS} debugMessage={"from @DetailIfNotGigOwner 2"} />
      <CustomScrollViewWithOneButton
        buttonTitle={user && gig.active ? "respond": null}
        buttonOnPress={user && gig.active ? respond : null}
        bottomMessage={bottomMessageText}
      >
        <Detail
          user={user}
          isGigOwner={isGigOwner}
          gig={gig}
          navigation={navigation}
        />
      </CustomScrollViewWithOneButton>
  </>
  )
}

function Detail({ user, isGigOwner, gig, navigation }) {
  const theme = useTheme();
  return (
    <>
      {user && !isGigOwner ? (
        <FavoriteGig
          navigation={navigation}
          gig={gig}
          isFavorite={gig.is_favorite}
          theme={theme}
        />
      ) : null}
      <View style={styles.imageAndGenresContainer}>
        <Image
          imageUri={gig.image}
          thumbnailUri={gig.thumbnail}
          containerStyle={styles.image}
        />
        <DisplayGenres
          genres={gig.genres}
          containerStyle={styles.genres}
        />
      </View>
      {isGigOwner && gig.replies ? (
        <GigRepliesButton
          gig={gig}
          navigation={navigation}
          theme={theme}
          containerStyle={{marginTop: 10}}
        />
      ) : null}
      <TextFieldWithTitle
        title={"gig"}
        text={gig.title}
      />
      <TextFieldWithTitle
        title={"location"}
        text={gig.location}
      />
      {gig.description ? (
        <TextFieldWithTitle
          title={"description"}
          text={gig.description}
        />
      ) : null}
      <TextFieldWithTitle
        title={"country"}
        text={gig.country.country}
      />
      {gig.has_spare_ticket ? (
        <TextFieldWithTitle
          title={"has spare ticket"}
          text={"yes"}
        />
      ) : null}
      {gig.is_past_gig ? (
        <TextFieldWithTitle
          title={"gig date"}
          text={`${dateFormat(gig.start_date, "fullDate")} - date has passed`}
          redText={true}
        />
      ) : (
        <TextFieldWithTitle
          title={"gig date"}
          text={`${dateFormat(gig.start_date, "fullDate")}`}
        />
      )}
      <UserProfileLink
        user={gig.user}
        title={"posted by"}
        navigation={navigation}
        theme={theme}
        containerStyle={styles.userProfileLink}
      />
      {isGigOwner && gig.active ? (
        <ShowAlbumsWithAddMusicButton
          resourceId={gig.id}
          type={"gig"}
          theme={theme}
          navigation={navigation}
        />
      ) : (
        <ShowAlbums
          resourceId={gig.id}
          type={"gig"}
          theme={theme}
          navigation={navigation}
        />
      )}
    </>
  )
}

const styles = StyleSheet.create({
  imageAndGenresContainer: {
    flexDirection: "row"
  },
  image: {
    margin: 10,
  },
  userProfileLink: {
    marginTop: 10,
  },
  genres: {
    width: "65%",
    alignItems: "flex-end",
  },
})

export default GigDetail;
