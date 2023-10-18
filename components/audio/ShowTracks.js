import {Text, useTheme} from "@react-native-material/core";
import {StyleSheet, View} from "react-native";
import audioPlayerStore from "../../store/audioPlayer";
import ShowTrack from "./ShowTrack";
import useUserStore from "../../store/user";
import {useNavigation} from "@react-navigation/native";

function ShowTracks({tracks, forceNoEditButton=false}) {
  const { object: user } = useUserStore();
  const navigation = useNavigation();
  const theme = useTheme();
  const { setTracksAndPlayTrack, playingTrack, paused } = audioPlayerStore();
  return (
    <View>
      <Text style={styles.title}>{"tracks"}</Text>
      {tracks.map((track) => (
        <ShowTrack
          key={track.id}
          track={track}
          tracks={tracks}
          setTracksAndPlayTrack={setTracksAndPlayTrack}
          isPlaying={track.id === playingTrack.id}
          paused={paused}
          forceNoEditButton={forceNoEditButton}
          isOwner={user.id === track.user.id}
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
