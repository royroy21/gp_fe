import CenteredModalWithOneButton from "../centeredModal/CenteredModalWithOneButton";
import FullPlayer from "./FullPlayer";

function FullPlayerWithModal(props) {
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
    showModal,
    setModal,
    clear,
    isWeb,
    isSmallScreen,
    theme,
  } = props;
  return (
    <CenteredModalWithOneButton showModal={showModal} setModal={setModal} >
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
        showModal={showModal}
        setModal={setModal}
        clear={clear}
        isWeb={isWeb}
        isSmallScreen={isSmallScreen}
        theme={theme}
      />
    </CenteredModalWithOneButton>
  )
}

export default FullPlayerWithModal;
