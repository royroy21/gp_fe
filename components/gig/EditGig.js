import {useForm} from "react-hook-form";
import {useState} from "react";
import useGigStore from "../../store/gig";
import BaseGigForm from "./BaseGigForm";
import {formatImageForForm, getDataWithOutImage} from "../Image/helpers";

function EditGig({ route, navigation }) {
  const { gig } = route.params;
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
  const {get, loading, error, patch, clear} = useGigStore();
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
        get(gig.id);
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

export default EditGig;
