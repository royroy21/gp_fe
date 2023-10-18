import React, {useEffect} from "react";
import {useTheme} from "@react-native-material/core";
import audioPlayerStore from "../../store/audioPlayer";
import MiniPlayer from "./MiniPlayer";
import FullPlayer from "./FullPlayer";

function AudioPlayer({ isWeb, isSmallScreen }) {
  const theme = useTheme();
  const {
    tracks,
    playingTrack,
    isPlaying,
    duration,
    position,
    finished,
    paused,
    playAudio,
    playFromPaused,
    pauseAudio,
    skipBackward,
    skipForward,
    playFromPositionAsync,
    clear,
  } = audioPlayerStore();

  useEffect(() => {
    // If song is finished skip to next track.
    if (finished) {
      skipForward();
    }
  }, [finished])

  return (
    <>
      {isWeb ? (
        <FullPlayer
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
          clear={clear}
          isWeb={isWeb}
          isSmallScreen={isSmallScreen}
          theme={theme}
        />
      ) : (
        <MiniPlayer
          tracks={tracks}
          playAudio={playAudio}
          playingTrack={playingTrack}
          position={position}
          duration={duration}
          skipBackward={skipBackward}
          skipForward={skipForward}
          paused={paused}
          playFromPaused={playFromPaused}
          pauseAudio={pauseAudio}
          playFromPositionAsync={playFromPositionAsync}
          clear={clear}
          isWeb={isWeb}
          isSmallScreen={isSmallScreen}
          theme={theme}
        />
      )}
    </>
  );
}

export default AudioPlayer;
