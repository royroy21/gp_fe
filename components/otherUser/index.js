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
import {useTheme} from "@react-native-material/core";
import ShowAlbums from "../audio/ShowAlbums";
import {useFocusEffect, useIsFocused} from "@react-navigation/native";
import useRoomStore from "../../store/room";
import {DEBUG} from "../../settings";
import ActiveUserGigsButton from "../gig/ActiveUserGigsButton";

function OtherUser({ navigation, route }) {
  const isFocused = useIsFocused();
  const { id } = route.params;
  const {
    object: otherUser,
    get: getOtherUser,
    loading: loadingFromOtherUser,
  } = useOtherUserStore();
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
  const [loadingMessageWS, setLoadingMessageWS] = useState(false);
  const [ error, setError] = useState(null);
  const { object: jwt } = useJWTStore();
  const accessToken = jwt ? JSON.parse(jwt).access : null;
  const { object: thisUser, loading: loadingFromUser } = useUserStore();
  const { store: storeRoom } = useRoomStore();

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
      return () => navigation.navigate("ProfilePage");
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
          title={"username"}
          text={user.username}
        />
        <TextFieldWithTitle
          title={"bio"}
          text={user.bio}
        />
        <TextFieldWithTitle
          title={"last seen"}
          text={user.distance_from_user ? user.distance_from_user : "last seen unknown"}
        />
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
