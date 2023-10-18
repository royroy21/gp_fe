import useUserStore from "../../store/user";
import DisplayGenres from "../gig/DisplayGenres";
import {StyleSheet, View} from "react-native";
import Image from "../Image/Image";
import React from "react";
import TextFieldWithTitle from "../fields/TextFieldWithTitle";
import CustomScrollViewWithOneButton from "../views/CustomScrollViewWithOneButton";
import ShowAlbumsWithAddMusicButton from "../audio/ShowAlbumsWithAddMusicButton";
import {useTheme} from "@react-native-material/core";

function ProfilePage({ navigation }) {
  const theme = useTheme();
  const { object } = useUserStore();

  const edit = () => {
    navigation.navigate("EditProfile");
  }
  return (
    <CustomScrollViewWithOneButton
      buttonTitle={"edit"}
      buttonOnPress={edit}
    >
      <View style={styles.imageAndGenresContainer}>
        <Image
          imageUri={object.image}
          thumbnailUri={object.thumbnail}
          containerStyle={styles.image}
        />
        <DisplayGenres
          genres={object.genres}
          containerStyle={styles.genres}
        />
      </View>
      <TextFieldWithTitle
        title={"username"}
        text={object.username}
      />
      <TextFieldWithTitle
        title={"email"}
        text={object.email}
      />
      <TextFieldWithTitle
        title={"bio"}
        text={object.bio}
      />
      <ShowAlbumsWithAddMusicButton
        resource={object}
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
})

export default ProfilePage;
