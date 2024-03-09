import ShowTracks from "./ShowTracks";
import {ScrollView, StyleSheet, View} from "react-native";
import TextTicker from "../Text/TextTicker";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import {Text} from "@react-native-material/core";

function FullPlayer(props) {
  const {
    tracks,
    playingTrack,
    position,
    duration,
    skipBackward,
    skipForward,
    paused,
    playFromPaused,
    pauseAudio,
    playFromPositionAsync,
    clear,
    isWeb,
    isSmallScreen,
    theme,
  } = props;
  const ButtonSize = 50;
  return (
    <View style={styles.container}>
      <ScrollView style={styles.tracksContainer}>
        <ShowTracks
          tracks={tracks}
          forceNoEditButton={true}
        />
      </ScrollView>
      <View>
        <View style={styles.playingTrackDataContainer}>
          <TextTicker
            style={{
              ...styles.playingTrackData,
              color: theme.palette.secondary.main,
            }}
          >
            {`playing ${playingTrack.title}`}
          </TextTicker>
        </View>
        <View style={styles.buttonsContainer}>
          <Icon
            name={"skip-previous"}
            color={"grey"}
            size={ButtonSize}
            onPress={skipBackward}
            style={styles.buttonBorder}
          />
          <Icon
            name={paused ? "play-circle" : "pause-circle"}
            color={"grey"}
            size={ButtonSize}
            onPress={paused ? playFromPaused : pauseAudio}
            style={{
              ...styles.buttonBorder,
              ...styles.playButton,
            }}
          />
          <Icon
            name={"skip-next"}
            color={"grey"}
            size={ButtonSize}
            onPress={skipForward}
            style={styles.buttonBorder}
          />
        </View>
        <View style={styles.positionContainer}>
          <Text
            style={{
              ...styles.position,
              color: theme.palette.secondary.main,
            }}
          >
            {`${position}/${duration}`}
          </Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    borderLeftColor: "grep",
  },
  tracksContainer: {
    height: 375,
  },
  buttonsContainer: {
    marginTop: 25,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
  },
  title: {
    fontSize: 12,
    marginLeft: 15,
    marginTop: 15,
    color: "gray",
  },
  playingTrackDataContainer: {
    marginTop: 25,
    width: 300,
    marginLeft: "auto",
    marginRight: "auto",
  },
  playingTrackData: {
    fontSize: 12,
    marginLeft: 15,
    marginTop: 15,
  },
  buttonBorder: {
    // borderWidth: 1,
    // borderRadius: 5,
    // borderColor: "grey",
  },
  playButton: {
    marginLeft: 30,
    marginRight: 30,
  },
  positionContainer: {
    marginTop: 15,
    marginLeft: "auto",
    marginRight: "auto",
  },
  position: {
    fontSize: 12,
  },
});

export default FullPlayer;
