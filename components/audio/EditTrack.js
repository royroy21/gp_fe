import React, {useCallback, useState} from "react";
import {useForm} from "react-hook-form";
import {Platform} from "react-native";
import {formatImageForForm} from "../Image/helpers";
import useTrackStore from "../../store/track";
import BaseTrackForm from "./BaseTrackForm";
import CustomScrollViewWithTwoButtons from "../views/CustomScrollViewWithTwoButtons";
import {useTheme} from "@react-native-material/core";
import {getDataWithOutFile, getDataWithOutImageAndFile} from "./helpers";
import {useFocusEffect, useIsFocused} from "@react-navigation/native";
import LoadingModal from "../loading/LoadingModal";
import useUserStore from "../../store/user";
import PleaseLoginMessage from "../loginSignUp/PleaseLoginMessage";
import DeleteModal from "../delete/DeleteModal";

function EditTrack({ navigation, route }) {
  const isFocused = useIsFocused();
  const { id, numberOfExistingTracks } = route.params;
  const theme = useTheme();

  const user = useUserStore((state) => state.object);

  const track = useTrackStore((state) => state.object);
  const get = useTrackStore((state) => state.get);
  const loading = useTrackStore((state) => state.loading);
  const error = useTrackStore((state) => state.error);
  const patch = useTrackStore((state) => state.patch);
  const deleteTrack = useTrackStore((state) => state.delete);
  const clear = useTrackStore((state) => state.clear);

  const [trackInState, setTrackInState] = useState(track);

  const correctTrackInState = () => {
    const formattedTrack = trackInState || {id: null};
    return formattedTrack.id === id;
  }

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      if (!isActive) {
        return
      }
      if (!correctTrackInState()) {
        get(id, setTrackInState);
      }

      return () => {
        isActive = false;
      };
    }, [id])
  );

  if (!isFocused) {
    return null
  }

  if (!user) {
    return (
      <PleaseLoginMessage theme={theme} />
    )
  }

  if (!correctTrackInState()) {
    return (
      <LoadingModal
        isLoading={loading}
        debugMessage={"from @EditTrack"}
      />
    )
  }

  return (
    <InnerEditTrack
      track={trackInState}
      numberOfExistingTracks={numberOfExistingTracks}
      loading={loading}
      error={error}
      patch={patch}
      deleteTrack={deleteTrack}
      clear={clear}
      navigation={navigation}
    />
  )
}

function InnerEditTrack(props) {
  /*
  NOTE! AUDIO DATA CANNOT BE CHANGED.
  ONLY DELETING AND RE-ADDING TRACK LOGIC IS AVAILABLE.
   */
  const {
    track,
    numberOfExistingTracks,
    loading,
    error,
    patch,
    deleteTrack,
    clear,
    navigation,
  } = props;

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
    navigation.push("AlbumDetail", {id: albumId, refresh: true});
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
      <DeleteModal
        showModal={deleteTrackModal}
        setModal={setDeleteTrackModal}
        action={deleteTrackAction}
        error={error}
      />
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

export default EditTrack;
