import React from "react";
import {StyleSheet, View} from "react-native";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import TextTicker from "../Text/TextTicker";
import FullPlayerWithModal from "./FullPlayerWithModal";

function MiniPlayer(props) {
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
  const [showFullPlayer, setShowFullPlayer] = React.useState(false);
  return (
    <View>
      {showFullPlayer && (
        <FullPlayerWithModal
          tracks={tracks}
          playingTrack={playingTrack}
          position={position}
          duration={duration}
          skipBackward={skipBackward}
          skipForward={skipForward}
          paused={paused}
          playFromPaused={playFromPaused}
          pauseAudio={pauseAudio}
          playFromPositionAsync={playFromPositionAsync}
          showModal={showFullPlayer}
          setModal={setShowFullPlayer}
          clear={clear}
          isWeb={isWeb}
          isSmallScreen={isSmallScreen}
          theme={theme}
        />
      )}
      <View style={{backgroundColor: theme.palette.background.main, ...styles.container}}>
        <Icon
          name={"chevron-up"}
          color={theme.palette.primary.main}
          size={ButtonSize}
          onPress={() => setShowFullPlayer(true)}
          style={styles.openFullPlayerButton}
        />
        <TextTicker
          style={{
            ...styles.playingTrackData,
            color: theme.palette.secondary.main,
          }}
        >
          {playingTrack.title}
        </TextTicker>
        <Icon
          name={"close-box"}
          color={"red"}
          size={ButtonSize}
          onPress={clear}
          style={styles.clearButton}
        />
        <Icon
          name={paused ? "play" : "pause"}
          color={theme.palette.primary.main}
          size={ButtonSize}
          onPress={paused ? playFromPaused : pauseAudio}
          style={styles.playButton}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
  },
  openFullPlayerButton: {
    marginLeft: 15,
  },
  clearButton: {
    marginLeft: "auto",
  },
  playButton: {
    marginRight: 15,
  },
  playingTrackData: {
    fontSize: 14,
    padding: 15,
    width: 200,
  },
  button: {
    margin: 10,
  },
});

export default MiniPlayer;
