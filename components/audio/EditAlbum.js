import React, {useState} from "react";
import {useForm} from "react-hook-form";
import BaseAlbumForm from "./BaseAlbumForm";
import {Platform} from "react-native";
import {formatImageForForm, getDataWithOutImage} from "../Image/helpers";
import useAlbumStore from "../../store/album";

function EditAlbum({navigation, route}) {
  const { album } = route.params;

  const isWeb = Boolean(Platform.OS === "web");
  const [numberOfGenres, setNumberOfGenres] = useState(album.genres.length);

  const getDefaultValues = () => {
    const defaultValues = {
      title: album.title,
      description: album.description,
      genres: album.genres,
      image: album.image,
    }
    if (album.gig) {
      defaultValues.gig = album.gig;
    } else {
      // assume type is profile.
      defaultValues.profile = album.profile;
    }
    return defaultValues;
  }

  const { control, handleSubmit, getValues, setValue, clearErrors } = useForm({
    defaultValues: getDefaultValues(),
  });

  const { get, loading, error, patch, clear } = useAlbumStore();

  let image = null;

  const onSubmit = async (data) => {
    /*
    NOTE! If an image is present first we upload string data using react-hook-form's
    data object then we upload image data separately afterwards using FormData.
     */

    if (typeof data.image === "string") {
      // Assume image has not been changed by user as URL from server.
      // EG: http://192.168.77.206:8000/media/gig/6da64...
      return await patch(album.id, getDataWithOutImage(data), onSuccess)
    }

    image = data.image;
    if (image) {
      // Upload new image.
      await patch(album.id, getDataWithOutImage(data), upLoadImage)
    } else {
      // User wants to remove the image.
      await patch(album.id, data, onSuccess)
    }
  }

  const upLoadImage = async (album) => {
    const formData = new FormData();
    if (isWeb) {
      formData.append("image", image);
      await patch(album.id, formData, onSuccess, true);
    } else {
      const formattedImage = formatImageForForm(image.uri);
      formData.append("image", formattedImage);
      await patch(album.id, formData, onSuccess, true);
    }
  }

  const onSuccess = (album) => {
    navigation.navigate("AlbumDetail", {albumId: album.id});
    return () => {
      setNumberOfGenres(0);
      image = null;
    };
  }

  return (
    <BaseAlbumForm
      isWeb={isWeb}
      control={control}
      handleSubmit={handleSubmit}
      getValues={getValues}
      setValue={setValue}
      loading={loading}
      error={error}
      clearErrors={() => {
        clear();
        clearErrors();
        get(album.id);
      }}
      numberOfGenres={numberOfGenres}
      setNumberOfGenres={setNumberOfGenres}
      onSubmit={onSubmit}
    />
  )
}

export default EditAlbum;
