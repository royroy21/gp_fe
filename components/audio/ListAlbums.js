import {Text} from "@react-native-material/core";
import {StyleSheet} from "react-native";
import React from "react";
import ShowAlbum from "./ShowAlbum";

function  ListAlbums({albums, showAlbumsWithoutTracks=false, navigation, theme}) {
  if (!albums) {
    return null
  }

  const getSomeAlbumsHaveTracks = () => {
    let oneOrMoreAlbumsHaveTracks = false;
    for (const album of albums.results) {
      if (album.number_of_tracks > 0) {
        oneOrMoreAlbumsHaveTracks = true;
        break;
      }
    }
    return oneOrMoreAlbumsHaveTracks
  }
  const someAlbumsHaveTracks = getSomeAlbumsHaveTracks();

  return (
    <>
      {(someAlbumsHaveTracks || showAlbumsWithoutTracks) && <Text style={styles.title}>{"albums"}</Text>}
      {(someAlbumsHaveTracks || showAlbumsWithoutTracks) && albums.results.map(album => {
        if (!album.number_of_tracks && !showAlbumsWithoutTracks) {
          return null
        }
        return (
          <ShowAlbum
            key={album.id}
            album={album}
            navigation={navigation}
            theme={theme}
          />
        )
      })}
    </>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 12,
    marginLeft: 15,
    marginTop: 15,
    color: "gray",
  },
});

export default ListAlbums;
