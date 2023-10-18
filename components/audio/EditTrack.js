import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Platform, StyleSheet} from "react-native";
import {formatImageForForm} from "../Image/helpers";
import useTrackStore from "../../store/track";
import BaseTrackForm from "./BaseTrackForm";
import CustomScrollViewWithTwoButtons from "../views/CustomScrollViewWithTwoButtons";
import CenteredModalWithTwoButton from "../centeredModal/CenteredModalWithTwoButtons";
import {Button, Text} from "@react-native-material/core";
import {getDataWithOutFile, getDataWithOutImageAndFile} from "./helpers";

function EditTrack({navigation, route}) {
  /*
  NOTE! AUDIO DATA CANNOT BE CHANGED.
  ONLY DELETING AND RE-ADDING TRACK LOGIC IS AVAILABLE.
   */

  const { track, numberOfExistingTracks } = route.params;
  const { album: albumId } = track;
  const isWeb = Boolean(Platform.OS === "web");
  const [deleteTrackModal, setDeleteTrackModal] = useState(false);

  const { control, handleSubmit, getValues, setValue, clearErrors } = useForm({
    defaultValues: {
      album: albumId,
      title: track.title,
      position: track.position,
      image: track.image,
      file: track.file,
    },
  });

  const { loading, error, patch, delete: deleteTrack, clear } = useTrackStore();

  let image = null;

  const onSubmit = async (data) => {
    /*
    NOTE! If an image or file is present first we upload string data using react-hook-form's
    data object then we upload image and file data separately afterwards using FormData.
     */
    if (typeof data.image === "string") {
      // Assume image has not been changed by user as URL is from server.
      // EG: http://192.168.77.206:8000/media/track/6da64...
      return await patch(track.id, getDataWithOutImageAndFile(data), onSuccess)
    }
    image = data.image;
    if (image) {
      // Upload new image.
      await patch(track.id, getDataWithOutImageAndFile(data), upLoadImage)
    } else {
      const dataWithOutFile = getDataWithOutFile(data);
      // User wants to remove the image.
      await patch(track.id, dataWithOutFile, onSuccess)
    }
  }

  const upLoadImage = async (track) => {
    const formData = new FormData();
    if (isWeb) {
      formData.append("image", image);
    } else {
      const formattedImage = formatImageForForm(image.uri);
      formData.append("image", formattedImage);
    }
    // Album must be here otherwise will
    // be marked as not active track.
    formData.append("album", albumId);
    formData.append("position", track.position);
    await patch(track.id, formData, onSuccess, true);
  }

  const onSuccess = () => {
    navigation.navigate("AlbumDetail", {albumId: albumId});
    return () => {
      setDeleteTrackModal(false);
      image = null;
    };
  }

  const deleteTrackAction = () => {
    deleteTrack(track.id, onSuccess);
  }

  return (
    <CustomScrollViewWithTwoButtons
      actionButton1Title={"submit"}
      actionButton1OnPress={handleSubmit(onSubmit)}
      actionButton2Title={"delete"}
      actionButton2OnPress={() => {setDeleteTrackModal(true)}}
    >
      <CenteredModalWithTwoButton
        showModal={deleteTrackModal}
        setModal={setDeleteTrackModal}
        actionButton={
          <Button
            style={styles.deleteButton}
            title={"delete"}
            onPress={deleteTrackAction}
          />
        }
      >
        <Text style={styles.areYouSureMessage}>{"Are you sure?"}</Text>
      </CenteredModalWithTwoButton>
      <BaseTrackForm
        isWeb={isWeb}
        control={control}
        getValues={getValues}
        setValue={setValue}
        numberOfExistingTracks={numberOfExistingTracks}
        loading={loading}
        noFileError={null}
        error={error}
        clearErrors={() => {
          clear();
          clearErrors();
        }}
      />
    </CustomScrollViewWithTwoButtons>
  )
}

const styles = StyleSheet.create({
  deleteButton: {
    width: 100,
  },
  areYouSureMessage: {
    width: "100%",
    textAlign: "center",
  },
})


export default EditTrack;
