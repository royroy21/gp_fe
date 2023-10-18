import {StyleSheet, View} from "react-native";
import React, {useState} from "react";
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

function OtherUser({ route, navigation }) {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const {object: jwt} = useJWTStore();
  if (!jwt) {
    navigation.navigate("DefaultScreen");
  }
  const accessToken = JSON.parse(jwt).access;
  const { user } = route.params;
  const {loading: loadingFromOtherUser} = useOtherUserStore();
  const {loading: loadingFromUser} = useUserStore();

  const directMessage = () => {
    const newMessageArguments = {
      navigation: navigation,
      parameters: "?type=direct&to_user_id=" + user.id,
      accessToken: accessToken,
      setLoading: setLoading,
      setError: setError,
    }
    newMessage(newMessageArguments);
  }

  const parsedError = error || {};
  return (
    <>
      {(parsedError.detail) && <Errors errorMessages={parsedError.detail} />}
      <LoadingModal isLoading={loading || loadingFromOtherUser || loadingFromUser} />
      <CustomScrollViewWithOneButton
        buttonTitle={"message"}
        buttonOnPress={directMessage}
      >
        <FavoriteUser
          navigation={navigation}
          user={user}
          isFavorite={user.is_favorite}
        />
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
        <ShowAlbums
          resource={user}
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
