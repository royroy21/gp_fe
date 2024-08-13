import {StyleSheet, View} from "react-native";
import React, {useCallback, useState} from "react";
import Errors from "../forms/Errors";
import LoadingModal from "../loading/LoadingModal";
import newMessage from "../message/newMessage";
import useJWTStore from "../../store/jwt";
import Image from "../Image/Image";
import DisplayGenres from "../gig/DisplayGenres";
import TextFieldWithTitle from "../fields/TextFieldWithTitle";
import CustomScrollViewWithOneButton from "../views/CustomScrollViewWithOneButton";
import FavoriteUser from "./FavoriteUser";
import useOtherUserStore from "../../store/otherUser";
import useUserStore from "../../store/user";
import {Text, useTheme} from "@react-native-material/core";
import ShowAlbums from "../audio/ShowAlbums";
import {useFocusEffect, useIsFocused} from "@react-navigation/native";
import useRoomStore from "../../store/room";
import {DEBUG} from "../../settings";
import ActiveUserGigsButton from "../gig/ActiveUserGigsButton";
import DisplayInstruments from "../gig/DisplayInstruments";

function OtherUser({ navigation, route }) {
  const isFocused = useIsFocused();
  const { id } = route.params;

  const otherUser = useOtherUserStore((state) => state.object);
  const getOtherUser = useOtherUserStore((state) => state.get);
  const loadingFromOtherUser = useOtherUserStore((state) => state.loading);

  const [otherUserInState, setOtherUserInState] = useState(otherUser);

  const correctOtherUserInState = () => {
    const formattedOtherUser = otherUserInState || {id: null};
    DEBUG && console.log("@OtherUser hits correctOtherUserInState ", formattedOtherUser, id);
    return formattedOtherUser.id === id;
  }

  useFocusEffect(
    useCallback(() => {
      DEBUG && console.log("@OtherUser hits 0");
      let isActive = true;
      if (!isActive) {
        DEBUG && console.log("@OtherUser hits 1 - not active");
        return
      }
      if (!correctOtherUserInState()) {
        DEBUG && console.log("@OtherUser hits 1 - not active");
        getOtherUser(id, setOtherUserInState);
      }
      return () => {
        isActive = false;
      };
    }, [id])
  );

  if (!isFocused) {
    DEBUG && console.log("@OtherUser hits 3 - not focused");
    return null
  }

  DEBUG && console.log("@OtherUser hits 4 - incorrect gig in state ", otherUserInState);
  if (!correctOtherUserInState()) {
    return (
      <LoadingModal
        isLoading={loadingFromOtherUser}
        debugMessage={"from @OtherUser 1"}
      />
    )
  }

  return (
    <InnerOtherUser
      user={otherUserInState}
      loadingFromOtherUser={loadingFromOtherUser}
      navigation={navigation}
    />
  )

}

function InnerOtherUser({ user, loadingFromOtherUser, navigation }) {
  const theme = useTheme();

  const jwt = useJWTStore((state) => state.object);
  const accessToken = jwt ? JSON.parse(jwt).access : null;

  const thisUser = useUserStore((state) => state.object);
  const loadingFromUser = useUserStore((state) => state.loading);

  const storeRoom = useRoomStore((state) => state.store);

  const [loadingMessageWS, setLoadingMessageWS] = useState(false);
  const [ error, setError] = useState(null);

  const directMessage = () => {
    const newMessageArguments = {
      storeRoom: storeRoom,
      navigation: navigation,
      parameters: "?type=direct&to_user_id=" + user.id,
      accessToken: accessToken,
      setLoading: setLoadingMessageWS,
      setError: setError,
    }
    newMessage(newMessageArguments);
  }

  useFocusEffect(
    useCallback(() => {
      return () => {
        setLoadingMessageWS(false);
        setError(null);
      };
    }, [])
  );

  const getUserIsViewingOwnPage = () => {
    const formattedUser = user || {id: null};
    const formattedThisUser = thisUser || {id: null};
    return (formattedThisUser.id && formattedUser.id) && (formattedThisUser.id === formattedUser.id)
  }

  const getButtonTitle = () => {
    if (getUserIsViewingOwnPage()) {
      return "profile"
    }
    return thisUser ? "message": null
  }

  const getButtonAction = () => {
    if (getUserIsViewingOwnPage()) {
      return () => navigation.push("ProfilePage");
    }
    return thisUser ? directMessage: null
  }

  if (!user) {
    return (
      <LoadingModal isLoading={loadingFromOtherUser} debugMessage={"from @OtherUser 1"}/>
    )
  }

  const parsedError = error || {};
  return (
    <>
      {(parsedError.detail) && <Errors errorMessages={parsedError.detail} />}
      <LoadingModal
        isLoading={loadingMessageWS || loadingFromOtherUser || loadingFromUser}
        debugMessage={"from @OtherUser 2"}
      />
      <CustomScrollViewWithOneButton
        buttonTitle={getButtonTitle()}
        buttonOnPress={getButtonAction()}
        bottomMessage={!thisUser && "Login to message this user"}
      >
        {thisUser && (
          <FavoriteUser
            navigation={navigation}
            user={user}
            isFavorite={user.is_favorite}
            theme={theme}
          />
        )}
        {user.is_looking_for_band && <Text style={styles.lookingFor}>{"LOOKING FOR BAND"}</Text>}
        {user.is_looking_for_musicians && <Text style={styles.lookingFor}>{"LOOKING FOR MUSICIANS"}</Text>}
        <View style={styles.imageAndGenresContainer}>
          <Image
            imageUri={user.image}
            thumbnailUri={user.thumbnail}
            containerStyle={styles.image}
          />
          <DisplayGenres
            genres={user.genres}
            containerStyle={styles.genres}
          />
        </View>
        <TextFieldWithTitle
          title={user.is_band ? "band name" : "username"}
          text={user.username}
        />
        <TextFieldWithTitle
          title={user.is_band ? "about band" : "about me"}
          text={user.bio}
        />
        <TextFieldWithTitle
          title={"last seen"}
          text={user.distance_from_user ? user.distance_from_user : "last seen unknown"}
        />
        <TextFieldWithTitle
          title={"location"}
          text={user.location}
        />
        {user.country ? (
          <TextFieldWithTitle
            title={"country"}
            text={user.country.country}
          />
        ) : null}
        {user.is_musician ? (
          <TextFieldWithTitle
            title={"musician"}
            trailing={
              <DisplayInstruments
                instruments={user.instruments}
              />
            }
          />
        ) : null}
        <ActiveUserGigsButton user={user} navigation={navigation} theme={theme} />
        <ShowAlbums
          resourceId={user.id}
          type={"profile"}
          theme={theme}
          navigation={navigation}
        />
      </CustomScrollViewWithOneButton>
    </>
  )
}

const styles = StyleSheet.create({
  lookingFor: {
    color: "grey",
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: 5,
  },
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

export default OtherUser;
