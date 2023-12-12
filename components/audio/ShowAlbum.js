import {Pressable, StyleSheet, View} from "react-native";
import Image from "../Image/Image";
import React from "react";
import {Surface, Text} from "@react-native-material/core";
import TextTicker from "../Text/TextTicker";
import DisplayGenres from "../gig/DisplayGenres";
import useAlbumStore from "../../store/album";

function ShowAlbum({album, navigation, theme}) {
  const store = useAlbumStore((state) => state.store);

  const goToAlbum = () => {
    store(album);
    navigation.push("AlbumDetail", {id: album.id});
  }

  return (
    <Surface elevation={2} category="medium" style={styles.surface}>
      <Pressable onPress={goToAlbum}>
        <View style={styles.container}>
          <Image
            imageUri={album.image}
            thumbnailUri={album.thumbnail}
            smallerThumbnail={true}
            withModalViewOnPress={false}
            containerStyle={styles.image}
            thumbnailStyle={styles.thumbnailStyle}
          />
          <TextTicker
            style={{
              color: theme.palette.secondary.main,
              ...styles.title,
            }}
          >
            {album.title}
          </TextTicker>
          <Text style={styles.noOfTracks}>{`${album.number_of_tracks} tracks`}</Text>
        </View>
        <DisplayGenres genres={album.genres} />
      </Pressable>
    </Surface>
  )
}

const styles = StyleSheet.create({
  surface: {
    paddingTop: 5,
    paddingLeft: 5,
    paddingRight: 5,
    paddingBottom: 8,
    margin: 5,
  },
  container: {
    flexDirection: "row",
  },
  title: {
    marginTop: 5,
    marginLeft: 10,
    width: 240,
  },
  noOfTracks: {
    alignSelf: "flex-end",
    marginLeft: "auto",
    fontSize: 12,
    paddingTop: 7,
    paddingRight: 5,
    height: "100%",
  },
  image: {
    margin: 5,
  },
  thumbnailStyle: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
});

export default ShowAlbum;
