import {useForm} from "react-hook-form";
import {useState} from "react";
import useGigStore from "../../store/gig";
import BaseGigForm from "./BaseGigForm";

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
    },
  });

  const {get, loading, error, patch, clear} = useGigStore();
  const onSubmit = async (data) => {
    await patch(gig.id, data, onSuccess)
  }

  const [numberOfGenres, setNumberOfGenres] = useState(gig.genres.length);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [hasSpareTicket, setHasSpareTicket] = useState(false);

  const onSuccess = (id) => {
    navigation.navigate("GigDetail", {id: id});
    return () => {
      setNumberOfGenres(0);
      setShowDatePicker(false);
      setHasSpareTicket(false);
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
