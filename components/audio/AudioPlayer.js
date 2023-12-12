import React, {useEffect} from "react";
import {useTheme} from "@react-native-material/core";
import audioPlayerStore from "../../store/audioPlayer";
import MiniPlayer from "./MiniPlayer";
import FullPlayer from "./FullPlayer";

function AudioPlayer({ isWeb, isSmallScreen }) {
  const theme = useTheme();

  const tracks = audioPlayerStore((state) => state.tracks);
  const playingTrack = audioPlayerStore((state) => state.playingTrack);
  const isPlaying = audioPlayerStore((state) => state.isPlaying);
  const duration = audioPlayerStore((state) => state.duration);
  const position = audioPlayerStore((state) => state.position);
  const finished = audioPlayerStore((state) => state.finished);
  const paused = audioPlayerStore((state) => state.paused);
  const playAudio = audioPlayerStore((state) => state.playAudio);
  const playFromPaused = audioPlayerStore((state) => state.playFromPaused);
  const pauseAudio = audioPlayerStore((state) => state.pauseAudio);
  const skipBackward = audioPlayerStore((state) => state.skipBackward);
  const skipForward = audioPlayerStore((state) => state.skipForward);
  const playFromPositionAsync = audioPlayerStore((state) => state.playFromPositionAsync);
  const clear = audioPlayerStore((state) => state.clear);

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
