import {Text, View} from "react-native";
import LoadingModal from "../loading/LoadingModal";
import Errors from "../forms/Errors";
import {Controller} from "react-hook-form";
import TextInput from "../forms/TextInput";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import DisplayGenres from "./DisplayGenres";
import {IconButton, ListItem, useTheme} from "@react-native-material/core";
import dateFormat from "dateformat";
import CalendarModal from "../calendar";
import useCountriesStore from "../../store/countries";
import useGenresStore from "../../store/genres";
import SelectDropdown from "../SelectDropdown";
import CustomScrollViewWithTwoButtons from "../views/CustomScrollViewWithTwoButtons";

function BaseGigForm(props) {
  const {
    navigation,
    control,
    handleSubmit,
    getValues,
    setValue,
    loading,
    error,
    clearErrors,
    numberOfGenres,
    setNumberOfGenres,
    showDatePicker,
    setShowDatePicker,
    hasSpareTicket,
    setHasSpareTicket,
    onSubmit,
    loadingCountry=false,
  } = props;

  const theme = useTheme();

  const {
    object: genres,
    search: searchGenres,
  } = useGenresStore();

  const {
    object: countries,
    search: searchCountries,
  } = useCountriesStore();

  const removeGenre = (genres, genreIDToRemove) => {
    const updatedGenres = genres.filter(genre => {return genre.id !== genreIDToRemove});
    setValue("genres", updatedGenres);
    setNumberOfGenres(updatedGenres.length);
  }

  const setDate = (date) => {
    setValue("start_date", date)
  }

  const cancel = () => {
    clearErrors();
    navigation.goBack();
  }

  const parsedError = error || {};
  return (
    <CustomScrollViewWithTwoButtons
      actionButtonTitle={"submit"}
      actionButtonOnPress={handleSubmit(onSubmit)}
      backButtonTitle={"go back"}
      backButtonOnPress={cancel}
    >
      <LoadingModal isLoading={loading || loadingCountry} />
      <CalendarModal
        visible={showDatePicker}
        date={getValues("start_date")}
        setDate={setDate}
        onRequestClose={() => setShowDatePicker(false)}
      />
      {(parsedError.detail) && <Errors errorMessages={parsedError.detail} />}
      {(parsedError.unExpectedError) && <Errors errorMessages={parsedError.unExpectedError} />}
        <Controller
          control={control}
          rules={{
           // required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label={"title, artist, band, festival .."}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="title"
        />
        {parsedError.title && <Errors errorMessages={parsedError.title} />}
        <Controller
          control={control}
          rules={{
           // required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label={"location, venue, pub, warehouse .."}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="location"
        />
        {parsedError.location && <Errors errorMessages={parsedError.location} />}
        <Controller
          control={control}
          rules={{
           // required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label={"description"}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              // It is important to note that multiline aligns the text to the top on iOS,
              // and centers it on Android. Use with textAlignVertical set to top for
              // the same behavior in both platforms.
              multiline={true}
            />
          )}
          name="description"
        />
        {parsedError.description && <Errors errorMessages={parsedError.description} />}
        <Controller
          control={control}
          rules={{
           // required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <SelectDropdown
              data={countries}
              defaultValue={value}
              onSelect={(selectedItem) => {
                onChange(selectedItem);
              }}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem.country;
              }}
              rowTextForSelection={(item, index) => {
                return `${item.country} (${item.code})`;
              }}
              defaultButtonText={value ? value.country : ""}
              searchPlaceHolder={"Search Country"}
              onChangeSearchInputText={(query) => searchCountries(query)}
            />
          )}
          name="country"
        />
        {parsedError.country && <Errors errorMessages={parsedError.country} />}
        {numberOfGenres ? (
          <DisplayGenres
            genres={getValues("genres")}
            removeGenre={removeGenre}
          />
          ) : null}
        <Controller
          control={control}
          rules={{
           // required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <SelectDropdown
              data={genres}
              defaultValue={value}
              onSelect={(selectedItem) => {
                const selectedGenres = getValues("genres");
                if (selectedGenres.map(genre => genre.id).includes(selectedItem.id)) {
                  return
                }
                selectedGenres.push(selectedItem);
                onChange(selectedGenres);
                setNumberOfGenres(selectedGenres.length)
              }}
              buttonTextAfterSelection={(selectedItem, index) => {
                return "select more genres?"
              }}
              rowTextForSelection={(item, index) => {
                return item.genre
              }}
              defaultButtonText={"select genres"}
              searchPlaceHolder={"Search Genres"}
              onChangeSearchInputText={(query) => searchGenres(query)}
            />
          )}
          name="genres"
        />
        {parsedError.genres && <Errors errorMessages={parsedError.genres} />}
        <View style={{marginTop: 2}}/>
        <ListItem
          title={
            <Text>{
              getValues("start_date")
              ? dateFormat(getValues("start_date"), "fullDate")
              : "gig start date?"
            }
            </Text>
          }
          onPress={() => setShowDatePicker(!showDatePicker)}
          trailing={
            <IconButton
              onPress={() => setShowDatePicker(!showDatePicker)}
              icon={
                <Icon
                  name="calendar"
                  size={25}
                  color={theme.palette.secondary.main}
                />
              }
            />
          }
        />
        {parsedError.start_date && <Errors errorMessages={parsedError.start_date} />}
        <View style={{marginTop: 2}}/>
        <ListItem
          title={
            <Text>
              {"have a spare ticket?"}
            </Text>
          }
          onPress={() => {
            const newValue = !hasSpareTicket;
            setHasSpareTicket(newValue);
            setValue("has_spare_ticket", newValue);
          }}
          trailing={
            getValues("has_spare_ticket") ? (
              <Icon
                name="thumb-up-outline"
                size={25}
                color={theme.palette.secondary.main}
              />
            ) : (
              <Icon
                name="thumb-down-outline"
                size={25}
                color={"grey"}
              />
            )
          }
        />
        {parsedError.has_spare_ticket && <Errors errorMessages={parsedError.has_spare_ticket} />}
    </CustomScrollViewWithTwoButtons>
  )
}

export default BaseGigForm;
