import BaseGigForm from "./BaseGigForm";
import {useForm} from "react-hook-form";
import {useState} from "react";
import useGigStore from "../../store/gig";
import useUserStore from "../../store/user";
import {formatImageForForm, getDataWithOutImage} from "../Image/helpers";
import {Platform} from "react-native";
import {DEFAULT_COUNTRY} from "../../settings";
import PleaseLoginMessage from "../loginSignUp/PleaseLoginMessage";
import {useTheme} from "@react-native-material/core";
import useGigsStore from "../../store/gigs";
import useMyGigsStore from "../../store/myGigs";

function AddGig({ navigation }) {
  const theme = useTheme();
  const user = useUserStore((state) => state.object);
  if (!user) {
    return (
      <PleaseLoginMessage theme={theme} />
    )
  }

  return (
    <InnerAddGig
      user={user}
      navigation={navigation}
    />
  )

}

function InnerAddGig({ user, navigation }) {
  const isWeb = Boolean(Platform.OS === "web");

  const storeGig = useGigStore((state) => state.store);

  const getGigs = useGigsStore((state) => state.get);
  const lastGigsURL = useGigsStore((state) => state.lastURL);
  
  const getMyGigs = useMyGigsStore((state) => state.get);
  const lastMyGigsURL = useMyGigsStore((state) => state.lastURL);

  const { control, handleSubmit, getValues, setValue, resetField, clearErrors } = useForm({
    defaultValues: {
      "title": "",
      "location": "",
      "country": user.country || DEFAULT_COUNTRY,
      "description": "",
      "genres": [],
      "start_date": null,
      "has_spare_ticket": false,
      "looking_for_gigpig": false,
      "is_free_gig": false,
      "image": null,
    },
  });

  let image = null;

  const loading = useGigStore((state) => state.loading);
  const error = useGigStore((state) => state.error);
  const post = useGigStore((state) => state.post);
  const patch = useGigStore((state) => state.patch);
  const clear = useGigStore((state) => state.clear);

  const onSubmit = async (data) => {
    /*
    NOTE! If an image is present first we upload string data using react-hook-form's
    data object then we upload image data separately afterward using FormData.
     */
    data.has_spare_ticket = hasSpareTicket;
    data.looking_for_gigpig = lookingForGigPig;
    data.is_free_gig = isFreeGig;

    image = data.image;
    if (image) {
      await post(getDataWithOutImage(data), upLoadImage)
    } else {
      await post(data, onSuccess)
    }
  }

  const [numberOfGenres, setNumberOfGenres] = useState(0);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [lookingForGigPig, setLookingForGigPig] = useState(false);
  const [isFreeGig, setIsFreeGig] = useState(false);
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
    storeGig(gig);
    if (lastGigsURL) {
      getGigs(lastGigsURL, [], true);
    }
    if (lastMyGigsURL) {
      getMyGigs(lastMyGigsURL, [], true);
    }
    navigation.push("GigDetail", {id: gig.id});
    return () => {
      setNumberOfGenres(0);
      setShowDatePicker(false);
      setLookingForGigPig(false);
      setIsFreeGig(false);
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
      clearErrors={() => {
        clear();
        clearErrors();
      }}
      numberOfGenres={numberOfGenres}
      setNumberOfGenres={setNumberOfGenres}
      showDatePicker={showDatePicker}
      setShowDatePicker={setShowDatePicker}
      lookingForGigPig={lookingForGigPig}
      setLookingForGigPig={setLookingForGigPig}
      isFreeGig={isFreeGig}
      setIsFreeGig={setIsFreeGig}
      hasSpareTicket={hasSpareTicket}
      setHasSpareTicket={setHasSpareTicket}
      onSubmit={onSubmit}
    />
  )
}

export default AddGig;
