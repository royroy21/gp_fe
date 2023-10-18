import { create } from 'zustand'
import {Audio} from "expo-av";

export const formatTime = (time) => {
  if (!time) {
    return "0";
  }
  return (time / 60).toFixed(0);
}

const audioPlayerStore = create((set, get) => ({
  audio: null,
  playAudioInitiated: false,
  tracks: null,
  playingTrack: {},
  isPlaying: null,
  duration: null,
  position: null,
  finished: null,
  paused: false,

  setTracksAndPlayTrack: async (tracks, playingTrack) => {
    set({tracks: tracks});
    await get().playAudio(playingTrack);
  },

  playAudio: async (track) => {
    set({playAudioInitiated: true});
    if (get().audio && (get().playingTrack.id === track.id)) {
      if (get().isPlaying) {
        await get().pauseAudio();
      } else {
        await get().playFromPaused();
      }
      return
    }
    if (get().audio) {
      await get().removeAudio();
    }
    const { sound } = await Audio.Sound.createAsync(
      {uri: track.file},
      { shouldPlay: false },
      get().onPlaybackStatusUpdate,
      true,
    );
    await sound.playAsync();
    set({
      playingTrack: track,
      audio: sound,
      paused: false,
      playAudioInitiated: false,
    })
  },

  onPlaybackStatusUpdate: status => {
    set({
      isPlaying: status.isPlaying,
      duration: formatTime(status.durationMillis),
      position: formatTime(status.positionMillis),
      finished: status.didJustFinish,
    })
  },

  restartTrack: async () => {
    await get().audio.replayAsync();
    set({paused: false});
  },

  playFromPaused: async () => {
    await get().audio.playAsync();
    set({paused: false});
  },

  pauseAudio: async () => {
    await get().audio.pauseAsync();
    set({paused: true});
  },

  removeAudio: async () => {
    await get().audio.unloadAsync();
    set({audio: null});
  },

  skipBackward: async () => {
    if (get().playAudioInitiated) {
      return
    }
    if (get().position && get().position > 1000) {
      await get().restartTrack();
      return
    }
    const previousTrack = get().getPreviousTrack();
    if (previousTrack) {
      await get().playAudio(previousTrack)
    } else {
      await get().restartTrack();
    }
  },

  getPreviousTrack: () => {
    const playingTrackId = get().playingTrack.id;
    if (!playingTrackId) {
      return null
    }
    const playingTrackIndex = get().tracks.map(track => track.id).indexOf(playingTrackId);
    if (playingTrackIndex === 0) {
      return null
    } else {
      return get().tracks[playingTrackIndex - 1]
    }
  },

  skipForward: async () => {
    if (get().playAudioInitiated) {
      return
    }
    const playingTrackId = get().playingTrack.id;
    if (!playingTrackId) {
      return null
    }
    const playingTrackIndex = get().tracks.map(track => track.id).indexOf(playingTrackId);
    const isLastTrack = playingTrackIndex + 1 === get().tracks.length;
    if (isLastTrack) {
      await get().playAudio(get().tracks[0]);
    } else {
      await get().playAudio(get().tracks[playingTrackIndex + 1]);
    }
  },

  playFromPositionAsync: async (position) => {
    if (get().playAudioInitiated) {
      return
    }
    await get().audio.playFromPositionAsync(position);
    set({paused: false});
  },

  clear: async () => {
    if (get().audio) {
      await get().audio.unloadAsync();
    }
    set({
      audio: null,
      playAudioInitiated: false,
      tracks: null,
      playingTrack: {},
      isPlaying: null,
      duration: null,
      position: null,
      finished: null,
      paused: false,
    })
  }
}));

export default audioPlayerStore;
