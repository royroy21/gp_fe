import useUserStore from "../../store/user";
import DisplayGenres from "../gig/DisplayGenres";
import {StyleSheet, View} from "react-native";
import Image from "../Image/Image";
import React from "react";
import TextFieldWithTitle from "../fields/TextFieldWithTitle";
import CustomScrollViewWithOneButton from "../views/CustomScrollViewWithOneButton";
import ShowAlbumsWithAddMusicButton from "../audio/ShowAlbumsWithAddMusicButton";
import {useTheme} from "@react-native-material/core";
import PleaseLoginMessage from "../loginSignUp/PleaseLoginMessage";
import MyGigsButton from "./MyGigsButton";
import DisplayInstruments from "../gig/DisplayInstruments";

function ProfilePage({ navigation }) {
  const theme = useTheme();

  const user = useUserStore((state) => state.object);

  if (!user) {
    return (
      <PleaseLoginMessage theme={theme} />
    )
  }

  const edit = () => {
    navigation.push("EditProfile");
  }
  return (
    <CustomScrollViewWithOneButton
      buttonTitle={"edit"}
      buttonOnPress={edit}
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
      />
      <TextFieldWithTitle
        title={"email"}
        text={user.email}
      />
      <TextFieldWithTitle
        title={"bio"}
        text={user.bio}
      />
      <TextFieldWithTitle
        title={"location"}
        text={user.location}
      />
      <TextFieldWithTitle
        title={"country"}
        text={user.country.country}
      />
      <DisplayInstruments
        instruments={user.instruments}
      />
      <MyGigsButton user={user} navigation={navigation} theme={theme} />
      <ShowAlbumsWithAddMusicButton
        resourceId={user.id}
        type={"profile"}
        theme={theme}
        navigation={navigation}
      />
    </CustomScrollViewWithOneButton>
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
  instruments: {
    width: "65%",
    alignItems: "flex-end",
  },
})

export default ProfilePage;
