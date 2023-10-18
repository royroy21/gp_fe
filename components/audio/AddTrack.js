import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Platform} from "react-native";
import {formatImageForForm} from "../Image/helpers";
import useTrackStore from "../../store/track";
import BaseTrackForm from "./BaseTrackForm";
import {formatAudioForForm, getDataWithOutImageAndFile} from "./helpers";
import CustomScrollViewWithOneButton from "../views/CustomScrollViewWithOneButton";

function AddTrack({navigation, route}) {
  const { album } = route.params;
  const isWeb = Boolean(Platform.OS === "web");
  const [noFileError, setNoFileError] = useState(null);

  const getPosition = () => {
    if (!album.tracks.length) {
      return 1  // Track will be first position.
    }
    return Math.max(...album.tracks.map(track => track.position)) + 1
  }

  const { control, handleSubmit, getValues, setValue, clearErrors } = useForm({
    defaultValues: {
      album: album.id,
      title: "",
      position: getPosition(),
      image: null,
      file: null,
    },
  });

  const { loading, error, post, patch, clear } = useTrackStore();

  let image = null;
  let file = null;

  const onSubmit = async (data) => {
    /*
    NOTE! If an image or file is present first we upload string data using react-hook-form's
    data object then we upload image and file data separately afterwards using FormData.
     */
    if (!data.file) {
      setNoFileError("Please select an audio track");
      return
    }
    if (noFileError) {
      setNoFileError(null);
    }
    image = data.image;
    file = data.file;
    await post(getDataWithOutImageAndFile(data), upLoadImageAndAudio)
  }

  const upLoadImageAndAudio = async (track) => {
    const formData = new FormData();
    if (isWeb) {
      if (image) {
        formData.append("image", image);
      }
      formData.append("file", file);
      // Album must be here otherwise will
      // be marked as not active track.
      formData.append("album", album.id);
      formData.append("position", track.position);
      await patch(track.id, formData, onSuccess, true);
    } else {
      if (image) {
        const formattedImage = formatImageForForm(image.uri);
        formData.append("image", formattedImage);
      }
      const formattedAudio = formatAudioForForm(file.uri)
      formData.append("file", formattedAudio);
      // Album must be here otherwise will
      // be marked as not active track.
      formData.append("album", album.id);
      formData.append("position", track.position);
      await patch(track.id, formData, onSuccess, true);
    }
  }

  const onSuccess = (audio) => {
    navigation.navigate("AlbumDetail", {albumId: audio.album.id});
    return () => {
      setNoFileError(null);
      image = null;
      file = null;
    };
  }

  return (
    <CustomScrollViewWithOneButton
      buttonTitle={"submit"}
      buttonOnPress={handleSubmit(onSubmit)}
    >
      <BaseTrackForm
        isWeb={isWeb}
        control={control}
        getValues={getValues}
        setValue={setValue}
        numberOfExistingTracks={album.tracks.length}
        loading={loading}
        noFileError={noFileError}
        error={error}
        clearErrors={() => {
          clear();
          clearErrors();
          setNoFileError(null);
        }}
      />
    </CustomScrollViewWithOneButton>
  )
}

export default AddTrack;
