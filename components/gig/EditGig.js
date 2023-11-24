import {useForm} from "react-hook-form";
import React, {useCallback, useState} from "react";
import useGigStore from "../../store/gig";
import BaseGigForm from "./BaseGigForm";
import {formatImageForForm, getDataWithOutImage} from "../Image/helpers";
import {Platform} from "react-native";
import {useFocusEffect, useIsFocused} from "@react-navigation/native";
import useUserStore from "../../store/user";
import LoadingModal from "../loading/LoadingModal";
import {useTheme} from "@react-native-material/core";
import PleaseLoginMessage from "../loginSignUp/PleaseLoginMessage";
import {DEBUG} from "../../settings";

function EditGig({ navigation, route }) {
  const isFocused = useIsFocused();
  const theme = useTheme();
  const { id } = route.params;
  const { object: user } = useUserStore();
  const {
    object: gig,
    get,
    store,
    loading,
    error,
    patch,
  } = useGigStore();
  const [gigInState, setGigInState] = useState(gig);

  const correctGigInState = () => {
    const formattedGig = gigInState || {id: null};
    DEBUG && console.log("@EditGig correctGigInState ", formattedGig, id);
    return formattedGig.id === id;
  }

  useFocusEffect(
    useCallback(() => {
      DEBUG && console.log("@GigEdit hits 0");
      let isActive = true;
      if (!isActive) {
        DEBUG && console.log("@GigEdit hits 1 - not active");
        return
      }
      if (!correctGigInState()) {
        DEBUG && console.log("@GigEdit hits 2 - getting gig");
        get(id, setGigInState);
      }

      return () => {
        isActive = false;
      };
    }, [id])
  );

  if (!isFocused) {
    DEBUG && console.log("@GigEdit hits 3 - not focused");
    return null
  }

  if (!user) {
    DEBUG && console.log("@GigEdit hits 4 - no user");
    return (
      <PleaseLoginMessage theme={theme} />
    )
  }

  if (!correctGigInState()) {
    DEBUG && console.log("@GigEdit hits 5 - loading as no gig");
    return (
      <LoadingModal
        isLoading={loading}
        debugMessage={"from @EditGig"}
      />
    )
  }


  DEBUG && console.log("@GigEdit hits 6 - display inner");
  return (
    <InnerEditGig
      gig={gigInState}
      get={get}
      store={store}
      loading={loading}
      error={error}
      patch={patch}
      navigation={navigation}
    />
  )
}

function InnerEditGig({ gig, get, store, loading, error, patch, navigation }) {
  const isWeb = Boolean(Platform.OS === "web");

  const { control, handleSubmit, getValues, setValue, clearErrors } = useForm({
    defaultValues: {
      "title": gig.title,
      "location": gig.location,
      "description": gig.description,
      "country": gig.country,
      "genres": gig.genres,
      "start_date": gig.start_date,
      "has_spare_ticket": gig.has_spare_ticket,
      "image": gig.image,
    },
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
      return await patch(gig.id, getDataWithOutImage(data), onSuccess)
    }

    image = data.image;
    if (image) {
      // Upload new image.
      await patch(gig.id, getDataWithOutImage(data), upLoadImage)
    } else {
      // User wants to remove the image.
      await patch(gig.id, data, onSuccess)
    }
  }

  const [numberOfGenres, setNumberOfGenres] = useState(gig.genres.length);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [hasSpareTicket, setHasSpareTicket] = useState(false);

  const upLoadImage = async (gig) => {
    const formData = new FormData();
    if (isWeb) {
      formData.append("image", image);
      await patch(gig.id, formData, onSuccess, true);
    } else {
      const formattedImage = formatImageForForm(image.uri);
      formData.append("image", formattedImage);
      await patch(gig.id, formData, onSuccess, true);
    }
  }

  const onSuccess = (gig) => {
    store(gig);
    navigation.push("GigDetail", {id: gig.id});
    return () => {
      setNumberOfGenres(0);
      setShowDatePicker(false);
      setHasSpareTicket(false);
      image = null;
    };
  }

  return (
    <BaseGigForm
      isWeb={isWeb}
      control={control}
      handleSubmit={handleSubmit}
      getValues={getValues}
      setValue={setValue}
      loading={loading}
      error={error}
      clearErrors={clearErrors}
      numberOfGenres={numberOfGenres}
      setNumberOfGenres={setNumberOfGenres}
      showDatePicker={showDatePicker}
      setShowDatePicker={setShowDatePicker}
      hasSpareTicket={hasSpareTicket}
      setHasSpareTicket={setHasSpareTicket}
      onSubmit={onSubmit}
    />
  )
}

export default EditGig;
