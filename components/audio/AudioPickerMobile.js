import {StyleSheet, View} from 'react-native';
import {Button} from "@react-native-material/core";
import * as DocumentPicker from 'expo-document-picker';
import { useCallback, useState } from "react";
import {useFocusEffect} from "@react-navigation/native";
import TextTicker from "../Text/TextTicker";

function AudioPickerMobile(props) {
  const {
    setAudio: setAudioToForm,
    removeAudio: removeAudioFromForm,
    existingAudio=null,
    theme,
  } = props;

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

  const pickAudioAsync = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*', // You can specify the file types you want to allow
      });
      if (result.type === 'success') {
        return result;
      }
    } catch (error) {
      setError(error)
    }
  }

  const pickAudio = () => {
    pickAudioAsync().then(data => {
      if (!data) {
        return
      }
      setAudio(data);
      setAudioToForm(data);
    })
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
      <Button
        title={"pick track"}
        onPress={pickAudio}
        style={styles.pickTrackButton}
      />
    )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
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

export default AudioPickerMobile;
