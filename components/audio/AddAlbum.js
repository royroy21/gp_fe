import React, {useState} from "react";
import {useForm} from "react-hook-form";
import BaseAlbumForm from "./BaseAlbumForm";
import {Platform} from "react-native";
import {formatImageForForm, getDataWithOutImage} from "../Image/helpers";
import useAlbumStore from "../../store/album";

function AddAlbum({navigation, route}) {
  const {
    resource,  // resource can be a gig or profile object.
    type,  // type must be one of "gig" or "profile".
  } = route.params;

  const isWeb = Boolean(Platform.OS === "web");
  const [numberOfGenres, setNumberOfGenres] = useState(0);

  const getDefaultValues = () => {
    const defaultValues = {
      title: "",
      description: "",
      genres: [],
      image: null,
    }
    if (type === "gig") {
      defaultValues.gig = resource;
    } else {
      // assume type is profile.
      defaultValues.profile = resource;
    }
    return defaultValues;
  }

  const { control, handleSubmit, getValues, setValue, clearErrors } = useForm({
    defaultValues: getDefaultValues(),
  });

  const { loading, error, post, patch, clear } = useAlbumStore();

  let image = null;

  const onSubmit = async (data) => {
    /*
    NOTE! If an image is present first we upload string data using react-hook-form's
    data object then we upload image data separately afterwards using FormData.
     */
    image = data.image;
    if (image) {
      await post(getDataWithOutImage(data), upLoadImage)
    } else {
      await post(data, onSuccess)
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
      }}
      numberOfGenres={numberOfGenres}
      setNumberOfGenres={setNumberOfGenres}
      onSubmit={onSubmit}
    />
  )
}

export default AddAlbum;
