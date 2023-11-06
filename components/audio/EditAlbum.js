import React, {useCallback, useState} from "react";
import {useForm} from "react-hook-form";
import BaseAlbumForm from "./BaseAlbumForm";
import {Platform} from "react-native";
import {formatImageForForm, getDataWithOutImage} from "../Image/helpers";
import useAlbumStore from "../../store/album";
import {useFocusEffect, useIsFocused} from "@react-navigation/native";
import useUserStore from "../../store/user";
import LoadingModal from "../loading/LoadingModal";
import PleaseLoginMessage from "../loginSignUp/PleaseLoginMessage";
import {useTheme} from "@react-native-material/core";
import {DEBUG} from "../../settings";

function EditAlbum({ navigation, route }) {
  const isFocused = useIsFocused();
  const theme = useTheme();
  const { id } = route.params;
  const { object: user } = useUserStore();

  const {
    object: album,
    get,
    store,
    loading,
    error,
    patch,
    clear,
  } = useAlbumStore();
  const [albumInState, setAlbumInState] = useState(album);

  const correctAlbumInState = () => {
    const formattedGig = albumInState || {id: null};
    return parseInt(formattedGig.id) === parseInt(id);
  }

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      if (!isActive) {
        return
      }
      const formattedAlbum = album || {id: null};
      if (!correctAlbumInState()) {
        get(id, setAlbumInState);
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

  if (!correctAlbumInState()) {
    return (
      <LoadingModal
        isLoading={loading}
        debugMessage={"from @EditAlbum"}
      />
    )
  }

  return (
    <InnerEditAlbum
      album={albumInState}
      get={get}
      store={store}
      loading={loading}
      error={error}
      patch={patch}
      clear={clear}
      navigation={navigation}
    />
  )
}

function InnerEditAlbum({ album, get, store, loading, error, patch, clear, navigation }) {
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
    store(album);
    navigation.push("AlbumDetail", {id: album.id});
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
