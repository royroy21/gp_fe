import {StyleSheet, View} from "react-native";
import {useTheme} from "@react-native-material/core";
import DisplayGenres from "./DisplayGenres";
import dateFormat from "dateformat";
import useUserStore from "../../store/user";
import Errors from "../forms/Errors";
import LoadingModal from "../loading/LoadingModal";
import React, {useState} from "react";
import newMessage from "../message/newMessage";
import useJWTStore from "../../store/jwt";
import Image from "../Image/Image";
import TextFieldWithTitle from "../fields/TextFieldWithTitle";
import UserProfileLink from "../profile/UserProfileLink";
import CustomScrollViewWithOneButton from "../views/CustomScrollViewWithOneButton";
import FavoriteGig from "./FavoriteGig";
import useGigStore from "../../store/gig";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import {BACKEND_ENDPOINTS} from "../../settings";

function GigDetail({route, navigation}) {
  const { gig } = route.params;
  const { object: user } = useUserStore();
  const {loading: loadingFromGig} = useGigStore();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const {object: jwt} = useJWTStore();
  if (!jwt) {
    navigation.navigate("DefaultScreen");
  }
  const accessToken = JSON.parse(jwt).access;
  const edit = () => {
    navigation.navigate("EditGig", {gig: gig});
  }
  const respond = () => {
    const newMessageArguments = {
      navigation: navigation,
      parameters: "?type=gig&gig_id=" + gig.id,
      accessToken: accessToken,
      setLoading: setLoading,
      setError: setError,
    }
    newMessage(newMessageArguments);
  }
  const isGigOwner = user && user.id === gig.user.id;

  const parsedError = error || {};
  return (
    <>
      {(parsedError.detail) && <Errors errorMessages={parsedError.detail} />}
      <LoadingModal isLoading={loading || loadingFromGig} />
      <CustomScrollViewWithOneButton
        buttonTitle={isGigOwner ? "edit" : "respond"}
        buttonOnPress={isGigOwner ? edit : respond}
      >
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
                  navigation.navigate(
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
          trailing={
            !isGigOwner ? (
              <FavoriteGig
                navigation={navigation}
                gig={gig}
                isFavorite={gig.is_favorite}
              />
            ) : null
          }
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
