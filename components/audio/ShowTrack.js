import {Pressable, StyleSheet, View} from "react-native";
import Image from "../Image/Image";
import React from "react";
import {Icon, IconButton, Surface} from "@react-native-material/core";
import TextTicker from "../Text/TextTicker";

function ShowTrack(props) {
  const {
    track,
    tracks,
    setTracksAndPlayTrack,
    isPlaying,
    paused,
    forceNoEditButton,
    isOwner,
    navigation,
    theme,
  } = props;
  const navigateToEditTrack = () => {
    navigation.navigate("EditTrack", {track: track, numberOfExistingTracks: tracks.length});
  }
  let iconName;
  if (!isPlaying) {
    iconName = "play";
  } else {
    iconName = isPlaying && paused ? "play" : "pause";
  }

  return (
    <Surface elevation={2} category="medium" style={styles.surface}>
      <Pressable onPress={async () => await setTracksAndPlayTrack(tracks, track)}>
        <View style={styles.container}>
          <Image
            imageUri={track.image}
            thumbnailUri={track.thumbnail}
            smallerThumbnail={true}
            withModalViewOnPress={false}
            containerStyle={styles.image}
            thumbnailStyle={styles.thumbnailStyle}
          />
          <Icon
            name={iconName}
            size={40}
            color={isPlaying ? theme.palette.secondary.main : "grey"}
          />
          <TextTicker style={{
            color: isPlaying ? theme.palette.secondary.main : "grey",
            ...styles.title,
          }}>
            {track.title}
          </TextTicker>
          {isOwner && !forceNoEditButton ? (
            <IconButton
              style={styles.editButton}
              onPress={navigateToEditTrack}
              icon={
                <Icon
                  name={"cog"}
                  size={30}
                  color={"grey"}
                />
              }
            />
          ) : null}
        </View>
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
    marginTop: 10,
    marginLeft: 10,
    width: 200,
  },
  image: {
    margin: 5,
  },
  thumbnailStyle: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  editButton: {
    marginRight: 5,
    marginLeft: "auto",
  },
});

export default ShowTrack;
