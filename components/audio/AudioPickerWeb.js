import {StyleSheet, View} from 'react-native';
import { Button } from "@react-native-material/core";
import {useCallback, useRef, useState} from "react";
import {useFocusEffect} from "@react-navigation/native";
import TextTicker from "../Text/TextTicker";

function AudioPickerWeb(props) {
  const {
    setAudio: setAudioToForm,
    removeAudio: removeAudioFromForm,
    existingAudio=null,
    theme,
  } = props;

  const inputFile = useRef(null);
  const [audio, setAudio] = useState(null);
  const [error, setError] = useState(null);

  useFocusEffect(
    useCallback(() => {
      if (existingAudio) {
        setAudio({
          uri: existingAudio.uri,
        })
      }
      return () => {
        setAudio(null);
        setError(null);
      }
    }, [])
  );

  const pickAudio = (e) => {
    const data = e.target.files[0]
    setAudio(data);
    setAudioToForm(data);
  }

  const removeAudio = () => {
    setAudio(null);
    removeAudioFromForm();
  }

  return (
    <View style={styles.container}>
    {audio ? (
      <>
        <TextTicker
          style={{
            color: theme.palette.secondary.main,
            ...styles.audioName,
          }}
        >
          {audio.name}
        </TextTicker>
        <Button
          title={"remove track"}
          onPress={removeAudio}
          style={styles.removeTrackButton}
        />
      </>
    ) : (
      <>
        <View style={{display: "none"}}>
           <input
             ref={inputFile}
             type={"file"}
             onChange={pickAudio}
             accept="audio/*"
           />
        </View>
        <Button
          title={"pick track"}
          onPress={() => inputFile.current.click()}
          style={styles.pickTrackButton}
        />
      </>
    )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    marginTop: 40,
    marginBottom: 20,
  },
  audioName: {
    marginLeft: 40,
  },
  removeTrackButton: {
    width: 160,
    marginLeft: 40,
    marginBottom: 5,
  },
  pickTrackButton: {
    width: 130,
    marginLeft: 40,
    marginBottom: 5,
  },
})

export default AudioPickerWeb;
