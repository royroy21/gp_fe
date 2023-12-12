import {Text, useTheme} from "@react-native-material/core";
import {StyleSheet, View} from "react-native";
import audioPlayerStore from "../../store/audioPlayer";
import ShowTrack from "./ShowTrack";
import useUserStore from "../../store/user";
import {useNavigation} from "@react-navigation/native";
import useTrackStore from "../../store/track";

function ShowTracks({tracks, forceNoEditButton=false}) {
  const navigation = useNavigation();
  const theme = useTheme();

  const user = useUserStore((state) => state.object);
  const storeTrack = useTrackStore((state) => state.store);

  const setTracksAndPlayTrack = audioPlayerStore((state) => state.setTracksAndPlayTrack);
  const playingTrack = audioPlayerStore((state) => state.playingTrack);
  const paused = audioPlayerStore((state) => state.paused);

  const getIsOwner = (track) => {
    if (!user) {
      return false
    }
    return user.id === track.user.id;
  }

  return (
    <View>
      <Text style={styles.title}>{"tracks"}</Text>
      {tracks.map((track) => (
        <ShowTrack
          key={track.id}
          track={track}
          tracks={tracks}
          storeTrack={storeTrack}
          setTracksAndPlayTrack={setTracksAndPlayTrack}
          isPlaying={track.id === playingTrack.id}
          paused={paused}
          forceNoEditButton={forceNoEditButton}
          isOwner={getIsOwner(track)}
          navigation={navigation}
          theme={theme}
        />
      ))}
    </View>
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

export default ShowTracks;
