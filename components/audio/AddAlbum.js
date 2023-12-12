import React, {useCallback, useState} from "react";
import {useForm} from "react-hook-form";
import BaseAlbumForm from "./BaseAlbumForm";
import {Platform} from "react-native";
import {formatImageForForm, getDataWithOutImage} from "../Image/helpers";
import useAlbumStore from "../../store/album";
import useUserStore from "../../store/user";
import {useFocusEffect} from "@react-navigation/native";
import useGigStore from "../../store/gig";
import LoadingModal from "../loading/LoadingModal";
import PleaseLoginMessage from "../loginSignUp/PleaseLoginMessage";
import {useTheme} from "@react-native-material/core";

function AddAlbum({ navigation, route }) {
  const {
    resourceId,  // resourceId can be a gig or profile.
    type,  // type must be one of "gig" or "profile".
  } = route.params;

  const theme = useTheme();

  const user = useUserStore((state) => state.object);

  const gig = useGigStore((state) => state.object);
  const getGig = useGigStore((state) => state.get);
  const loadingGig = useGigStore((state) => state.loading);

  const [ resource, setResource ] = useState(null);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      if (!isActive) {
        return
      }
      if (type === "gig") {
        const formattedGig = gig || {id: null};
        if (resourceId !== formattedGig.id) {
          getGig(resourceId, setResource);
        } else {
          setResource(resource);
        }
      } else {
        // Assume resource is user profile.
        setResource(user)
      }

      return () => {
        isActive = false;
      };
    }, [user, gig, resourceId])
  );

  if (!user) {
    return (
      <PleaseLoginMessage theme={theme} />
    )
  }

  if (!resource) {
    return (
      <LoadingModal
        isLoading={loadingGig}
        debugMessage={"from @AddAlbum"}
      />
    )
  }

  return (
    <InnerAddAlbum
      resource={resource}
      type={type}
      navigation={navigation}
    />
  )
}

function InnerAddAlbum({ resource, type, navigation }) {
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

  const store = useAlbumStore((state) => state.store);
  const loading = useAlbumStore((state) => state.loading);
  const error = useAlbumStore((state) => state.error);
  const post = useAlbumStore((state) => state.post);
  const patch = useAlbumStore((state) => state.patch);
  const clear = useAlbumStore((state) => state.clear);

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
      }}
      numberOfGenres={numberOfGenres}
      setNumberOfGenres={setNumberOfGenres}
      onSubmit={onSubmit}
    />
  )
}

export default AddAlbum;
