import LoadingModal from "../loading/LoadingModal";
import ImagePickerWeb from "../Image/ImagePickerWeb";
import ImagePickerMobile from "../Image/ImagePickerMobile";
import Errors from "../forms/Errors";
import {Controller} from "react-hook-form";
import TextInput from "../forms/TextInput";
import {Button, ListItem, Text, useTheme} from "@react-native-material/core";
import React, {useEffect, useState} from "react";
import AudioPickerMobile from "./AudioPickerMobile";
import TextTicker from "../Text/TextTicker";
import {getAudioNameFromUri} from "./helpers";
import AudioPickerWeb from "./AudioPickerWeb";
import {ScrollView, StyleSheet} from "react-native";
import CenteredModalWithOneButton from "../centeredModal/CenteredModalWithOneButton";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

function DisplayTrackOrTrackPicker({setAudio, removeAudio, existingAudio, isWeb, theme}) {
  if (typeof existingAudio === "string") {
    return (
      <TextTicker style={{color: theme.palette.secondary.main}}>
        {getAudioNameFromUri(existingAudio)}
      </TextTicker>
    )
  }

  return (
    <>
      {isWeb ? (
        <AudioPickerWeb
          setAudio={setAudio}
          removeAudio={removeAudio}
          existingAudio={existingAudio}
          theme={theme}
        />
      ) : (
        <AudioPickerMobile
          setAudio={setAudio}
          removeAudio={removeAudio}
          existingAudio={existingAudio}
          theme={theme}
        />
      )}
    </>
  )
}

function BaseTrackForm(props) {
  const {
    isWeb,
    control,
    numberOfExistingTracks,
    getValues,
    setValue,
    loading,
    noFileError,
    error,
    clearErrors,
  } = props;

  const theme = useTheme();
  const [showSetPosition, setShowSetPosition] = useState(false);
  const [newPosition, setNewPosition] = useState(getValues("position"));

  useEffect(() => {
    return () => {
      clearErrors();
    }
  }, []);

  const setImage = (image) => {
    setValue("image", image)
  }

  const removeImage = () => {
    setValue("image", null)
  }

  const setAudio = (image) => {
    setValue("file", image)
  }

  const removeAudio = () => {
    setValue("file", null)
  }

  const parsedError = error || {};
  return (
    <>
      <LoadingModal isLoading={loading} />
      {(parsedError.detail) && <Errors errorMessages={parsedError.detail} />}
      {(parsedError.unExpectedError) && <Errors errorMessages={parsedError.unExpectedError} />}
      {parsedError.position && <Errors errorMessages={parsedError.position} />}
      {isWeb ? (
        <ImagePickerWeb
          setImage={setImage}
          removeImage={removeImage}
          existingImage={getValues("image")}
        />
        ) : (
        <ImagePickerMobile
          setImage={setImage}
          removeImage={removeImage}
          existingImage={getValues("image")}
        />
      )}
      {parsedError.image && <Errors errorMessages={parsedError.image} />}
      <DisplayTrackOrTrackPicker
        setAudio={setAudio}
        removeAudio={removeAudio}
        existingAudio={getValues("file")}
        isWeb={isWeb}
        theme={theme}
      />
      {parsedError.file && <Errors errorMessages={parsedError.file} />}
      {noFileError && <Errors errorMessages={noFileError} />}
      <Controller
        control={control}
        rules={{
         // required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label={"title"}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="title"
      />
      {parsedError.title && <Errors errorMessages={parsedError.title} />}
      <>
        <CenteredModalWithOneButton
          showModal={showSetPosition}
          setModal={setShowSetPosition}
        >
          <ScrollView>
          {Array.from({length: numberOfExistingTracks}, (_, i) => i + 1).map(position => (
            <ListItem
              key={position}
              leadingMode={"icon"}
              leading={position === newPosition ? (
                <Icon
                  name={"music"}
                  size={25}
                  color={theme.palette.secondary.main}
                />
              ) : null }
              title={position}
              onPress={() => {
                setValue("position", position)
                setNewPosition(position);
              }}
            />
          ))}
          </ScrollView>
        </CenteredModalWithOneButton>
        <Text
          style={{
            color: theme.palette.secondary.main,
            ...styles.setPositionText,
          }}
        >
          {`track position: ${getValues("position")}`}
        </Text>
        <Button
          title={"set position"}
          onPress={() => setShowSetPosition(true)}
          style={styles.setPositionButton}
        />
      </>
    </>
  )
}

const styles = StyleSheet.create({
  setPositionText: {
    marginTop: 25,
  },
  setPositionButton: {
    width: 150,
  },
});

export default BaseTrackForm;
