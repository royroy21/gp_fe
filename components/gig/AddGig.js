import BaseGigForm from "./BaseGigForm";
import {useForm} from "react-hook-form";
import useCountryStore from "../../store/country";
import {useEffect, useState} from "react";
import useGigStore from "../../store/gig";
import useUserStore from "../../store/user";

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
    },
  });
  useEffect(() => {getCountry(user, resetField)}, [])

  const { loading, error, post, clear } = useGigStore();
  const onSubmit = async (data) => {
    await post(data, onSuccess)
  }

  const [numberOfGenres, setNumberOfGenres] = useState(0);
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
