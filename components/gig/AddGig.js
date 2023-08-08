import BaseGigForm from "./BaseGigForm";
import {useForm} from "react-hook-form";
import useCountryStore from "../../store/country";
import {useEffect, useState} from "react";
import useGigStore from "../../store/gig";
import useUserStore from "../../store/user";
import {formatImageForForm, getDataWithOutImage} from "../Image/helpers";

function AddGig({ navigation }) {
  const {object: defaultCountry, loading: loadingCountry, get: getCountry} = useCountryStore();
  const { object: user } = useUserStore();
  const { control, handleSubmit, getValues, setValue, resetField, clearErrors } = useForm({
    defaultValues: {
      "title": "",
      "location": "",
      "country": defaultCountry,
      "description": "",
      "genres": [],
      "start_date": null,
      "has_spare_ticket": false,
      "image": null,
    },
  });
  useEffect(() => {getCountry(user, resetField)}, [])

  let image = null;
  const { loading, error, post, patch, clear } = useGigStore();
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

  const [numberOfGenres, setNumberOfGenres] = useState(0);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [hasSpareTicket, setHasSpareTicket] = useState(false);

  const upLoadImage = async (gig) => {
    const formData = new FormData();
    const formattedImage = formatImageForForm(image.uri);
    formData.append("image", formattedImage);
    await patch(gig.id, formData, onSuccess, true);
  }

  const onSuccess = (gig) => {
    navigation.navigate("GigDetail", {gig: gig});
    return () => {
      setNumberOfGenres(0);
      setShowDatePicker(false);
      setHasSpareTicket(false);
      image = null;
    };
  }

  return (
    <BaseGigForm
      navigation={navigation}
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
      loadingCountry={loadingCountry}
    />
  )
}

export default AddGig;
