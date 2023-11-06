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
import {useNavigation} from "@react-navigation/native";

function AddGig({ navigation }) {
  const { object: user } = useUserStore();
  const theme = useTheme();

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

  // const navigate = useNavigation();

  const isWeb = Boolean(Platform.OS === "web");

  const {
    store: storeGig,
  } = useGigStore();

  const { control, handleSubmit, getValues, setValue, resetField, clearErrors } = useForm({
    defaultValues: {
      "title": "",
      "location": "",
      "country": user.country || DEFAULT_COUNTRY,
      "description": "",
      "genres": [],
      "start_date": null,
      "has_spare_ticket": false,
      "image": null,
    },
  });

  let image = null;
  const { loading, error, post, patch, clear } = useGigStore();
  const onSubmit = async (data) => {
    /*
    NOTE! If an image is present first we upload string data using react-hook-form's
    data object then we upload image data separately afterward using FormData.
     */
    image = data.image;
    if (image) {
      await post(getDataWithOutImage(data), upLoadImage)
    } else {
      await post(data, onSuccess)
    }
  }

  const [numberOfGenres, setNumberOfGenres] = useState(0);
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
    storeGig(gig);
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
      clearErrors={() => {
        clear();
        clearErrors();
      }}
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

export default AddGig;
