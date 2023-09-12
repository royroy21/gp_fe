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

function OtherUser({ route, navigation }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const {object: jwt} = useJWTStore();
  if (!jwt) {
    navigation.navigate("DefaultScreen");
  }
  const accessToken = JSON.parse(jwt).access;
  const { user } = route.params;
  const {loading: loadingFromOtherUser} = useOtherUserStore();

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
      <LoadingModal isLoading={loading || loadingFromOtherUser} />
      <CustomScrollViewWithOneButton
        buttonTitle={"message"}
        buttonOnPress={directMessage}
      >
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
          trailing={
            <FavoriteUser
              navigation={navigation}
              user={user}
              isFavorite={user.is_favorite}
            />
          }
        />
        <TextFieldWithTitle
          title={"bio"}
          text={user.bio}
        />
        <TextFieldWithTitle
          title={"last seen"}
          text={user.distance_from_user ? user.distance_from_user : "last seen unknown"}
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
