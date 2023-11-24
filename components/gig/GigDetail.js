import {StyleSheet, View} from "react-native";
import {useTheme} from "@react-native-material/core";
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

function GigDetail({ navigation, route }) {
  const isFocused = useIsFocused();
  const { id } = route.params;
  const { object: user } = useUserStore();
  const {object: gig, get: getGig, loading} = useGigStore();
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
      navigation={navigation}
    />
  )
}

function InnerGigDetail({ user, gig, loading, navigation }) {
  const { store: storeRoom } = useRoomStore();
  const theme = useTheme();
  const [loadingMessageWS, setLoadingMessageWS] = useState(false);
  const [error, setError] = useState(null);
  const {object: jwt} = useJWTStore();
  const accessToken = jwt ? JSON.parse(jwt).access : null;

  const edit = () => {
    navigation.push("EditGig", {id: gig.id});
  }

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

  const getIsGigOwner = () => {
    if (!user || !gig) {
      return false
    }
    return user.id === gig.user.id;
  }
  const isGigOwner = getIsGigOwner();

  const getButtonTitle = () => {
    if (!user) {
      return null
    }
    return isGigOwner ? "edit" : "respond";
  }

  const buttonOnPress = () => {
    if (!user) {
      return null
    }
    return isGigOwner ? edit : respond;
  }

  const parsedError = error || {};
  return (
    <>
      {(parsedError.detail) && <Errors errorMessages={parsedError.detail} />}
      <LoadingModal isLoading={loading || loadingMessageWS} debugMessage={"from @GigDetail 2"} />
      <CustomScrollViewWithOneButton
        buttonTitle={getButtonTitle()}
        buttonOnPress={buttonOnPress()}
        bottomMessage={!user && "Login to respond"}
      >
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
          <TextFieldWithTitle
            title={"replies"}
            text={gig.replies}
            trailing={
              <Icon
                onPress={() => {
                  navigation.push(
                    "RoomsScreen",
                    {"initialQuery": BACKEND_ENDPOINTS.room + `?gig_id=${gig.id}`})
                }}
                name={"speaker-wireless"}
                size={25}
                color={"orange"}
              />
            }
          />
        ) : null}
        <TextFieldWithTitle
          title={"gig"}
          text={gig.title}
        />
        {gig.description ? (
          <TextFieldWithTitle
            title={"description"}
            text={gig.description}
          />
        ) : null}
        <TextFieldWithTitle
          title={"location"}
          text={gig.location}
        />
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
        <TextFieldWithTitle
          title={"gig date"}
          text={`${dateFormat(gig.start_date, "fullDate")}`}
        />
        <UserProfileLink
          user={gig.user}
          title={"posted by"}
          navigation={navigation}
          theme={theme}
          containerStyle={styles.userProfileLink}
        />
        {isGigOwner ? (
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
      </CustomScrollViewWithOneButton>
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
