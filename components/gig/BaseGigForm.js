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
import {useEffect} from "react";
import ImagePickerMobile from "../Image/ImagePickerMobile";
import CustomScrollViewWithOneButton from "../views/CustomScrollViewWithOneButton";
import ImagePickerWeb from "../Image/ImagePickerWeb";
import SelectCountry from "../selectors/SelectCountry";
import SelectGenres from "../selectors/SelectGenres";

function BaseGigForm(props) {
  const {
    isWeb,
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
  } = props;

  const theme = useTheme();

  useEffect(() => {
    return () => {
      clearErrors();
    }
  }, []);

  const removeGenre = (genres, genreIDToRemove) => {
    const updatedGenres = genres.filter(genre => {return genre.id !== genreIDToRemove});
    setValue("genres", updatedGenres);
    setNumberOfGenres(updatedGenres.length);
  }

  const setDate = (date) => {
    setValue("start_date", date)
  }

  const setImage = (image) => {
    setValue("image", image)
  }

  const removeImage = () => {
    setValue("image", null)
  }

  const parsedError = error || {};
  return (
    <CustomScrollViewWithOneButton
      buttonTitle={"submit"}
      buttonOnPress={handleSubmit(onSubmit)}
    >
      <LoadingModal isLoading={loading} debugMessage={"from @BaseGigForm"}/>
      <CalendarModal
        visible={showDatePicker}
        date={getValues("start_date")}
        setDate={setDate}
        onRequestClose={() => setShowDatePicker(false)}
      />
      {(parsedError.detail) && <Errors errorMessages={parsedError.detail} />}
      {(parsedError.unExpectedError) && <Errors errorMessages={parsedError.unExpectedError} />}
      {isWeb ? (
        <ImagePickerWeb
          setImage={setImage}
          removeImage={removeImage}
          existingImage={getValues("image")}
        />
        ) : (
        <ImagePickerMobile
          setImage={setImage}
          removeImage={removeImage}
          existingImage={getValues("image")}
        />
        )}
        {parsedError.image && <Errors errorMessages={parsedError.image} />}
        <Controller
          control={control}
          rules={{
           // required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label={"gig, artist, band, festival .."}
              // label={"gig, artist, band, festival, jam .."}
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
              // label={"venue, pub, warehouse, flat, garage .."}
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
            <SelectCountry
              defaultCountry={value}
              onSelect={onChange}
              theme={theme}
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
            <SelectGenres
              onSelect={(selectedItem) => {
                const selectedGenres = getValues("genres");
                if (selectedGenres.map(genre => genre.id).includes(selectedItem.id)) {
                  // Remove genre
                  const filteredGenres = selectedGenres.filter(genre => genre.id !== selectedItem.id);
                  onChange(filteredGenres);
                  setNumberOfGenres(filteredGenres.length)
                } else {
                  // Add genre
                  selectedGenres.push(selectedItem);
                  onChange(selectedGenres);
                  setNumberOfGenres(selectedGenres.length)
                }
              }}
              genresForDisplayGenres={getValues("genres")}
              selectedGenres={getValues("genres")}
              theme={theme}
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
            <View>
              <Text>
                {"looking for a GigPig?"}
              </Text>
              <Text style={{fontSize: 12, color: "grey"}}>
                {"*someone to gig with"}
              </Text>
            </View>
          }
          onPress={() => {
            const newValue = !hasSpareTicket;
            setHasSpareTicket(newValue);
            setValue("looking_for_gigpig", newValue);
          }}
          trailing={
            getValues("looking_for_gigpig") ? (
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
        {parsedError.looking_for_gigpig && <Errors errorMessages={parsedError.looking_for_gigpig} />}
        <View style={{marginTop: 2}}/>
        <ListItem
          title={
            <Text>
              {"is a free gig?"}
            </Text>
          }
          onPress={() => {
            const newValue = !hasSpareTicket;
            setHasSpareTicket(newValue);
            setValue("is_free_gig", newValue);
          }}
          trailing={
            getValues("is_free_gig") ? (
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
        {parsedError.is_free_gig && <Errors errorMessages={parsedError.is_free_gig} />}
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
    </CustomScrollViewWithOneButton>
  )
}

export default BaseGigForm;
