import {Dimensions, ScrollView, StyleSheet, Text, View} from "react-native";
import {Button, IconButton, ListItem, useTheme} from "@react-native-material/core";
import {Controller, useForm} from "react-hook-form";
import {useEffect, useState} from "react";
import TextInput from "../forms/TextInput";
import SelectDropdown from 'react-native-select-dropdown';
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import searchCountries from "../location/searchCountries";
import LoadingModal from "../loading/LoadingModal";
import searchGenres from "../genre/searchGenres";
import DisplayGenres from "./DisplayGenres";
import dateFormat from "dateformat";
import CalendarModal from "../calendar";
import postGigs from "./postGig";
import Errors from "../forms/Errors";

function AddGigModal(props) {
  const {
    defaultCountry,
    countries,
    setCountries,
    setShowAddGig,
  } = props;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  const [genres, setGenres] = useState([]);
  // Hacky way to trigger rerender when a new genre is added or removed
  const [numberOfGenres, setNumberOfGenres] = useState(0);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [hasSpareTicket, setHasSpareTicket] = useState(false);

  const onError = (error) => {
    setLoading(false);
    setError(error);
  }

  const onSubmit = async (data) => {
    setError(null);
    setLoading(true);
    await postGigs(data, setResponse, onError);
    setLoading(false);
  }

  useEffect(() => {onSuccess()}, [response]);
  const onSuccess = () => {

    console.log("response: ", response);

    // Redirect to newly created gig page
    return () => {
      setLoading(false);
      setError(null);
      setResponse(null);
      setGenres([]);
      setNumberOfGenres(0);
      setShowDatePicker(false);
      setHasSpareTicket(false);
    };
  }

  const { control, handleSubmit, getValues, setValue } = useForm({
    defaultValues: {
      "title": "",
      "location": "",
      "country": defaultCountry,
      "genres": [],
      "start_date": null,
      "has_spare_ticket": false,
    },
  });

  const removeGenre = (genres, genreIDToRemove) => {
    const updatedGenres = genres.filter(genre => {return genre.id !== genreIDToRemove});
    setValue("genres", updatedGenres);
    setNumberOfGenres(updatedGenres.length);
  }

  const setDate = (date) => {
    setValue("start_date", date)
  }

  const theme = useTheme()
  const windowHeight = Dimensions.get('window').height;
  const windowWidth = Dimensions.get('window').width;

  const parsedError = error || {};
  return (
    <>
      <LoadingModal isLoading={loading} />
      <View style={{
        backgroundColor: theme.palette.background.main,
        marginTop: Math.round(windowHeight * 0.1),
        width: Math.round(windowWidth * 0.9),
        maxHeight: Math.round(windowHeight * 0.8),
        ...styles.modalContainer,
      }}>
        <ScrollView>
          <Text style={styles.title}>{"Add Gig"}</Text>
          {(parsedError.detail) && <Errors errorMessages={parsedError.detail} />}
          {(parsedError.unExpectedError) && <Errors errorMessages={parsedError.unExpectedError} />}
          <View style={styles.formContainer}>
            <Controller
              control={control}
              rules={{
               // required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label={"title, artist, band or festival"}
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
                  label={"venue, pub, warehouse or location"}
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
                  defaultValue={defaultCountry}
                  onSelect={(selectedItem) => {
                    onChange(selectedItem);
                  }}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return `country: ${selectedItem.country}`;
                  }}
                  rowTextForSelection={(item, index) => {
                    return `${item.country} (${item.code})`
                  }}
                  defaultButtonText={"Select country"}
                  buttonStyle={styles.dropdownButton}
                  buttonTextStyle={styles.dropdownButtonText}
                  rowTextStyle={styles.dropdownRowTextStyle}
                  search={true}
                  searchInputStyle={styles.dropdownSearchInputStyleStyle}
                  searchPlaceHolder={"Search Country"}
                  renderSearchInputLeftIcon={() => {
                    return <Icon name="magnify" size={25} />;
                  }}
                  onChangeSearchInputText={(query) => searchCountries(query, setCountries)}
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
                  defaultValue={defaultCountry}
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
                    return "Select more genres?"
                  }}
                  rowTextForSelection={(item, index) => {
                    return item.genre
                  }}
                  defaultButtonText={"select genres"}
                  buttonStyle={{
                    ...styles.dropdownButton,
                    marginTop: 5,
                  }}
                  buttonTextStyle={styles.dropdownButtonText}
                  rowTextStyle={styles.dropdownRowTextStyle}
                  search={true}
                  searchInputStyle={styles.dropdownSearchInputStyleStyle}
                  searchPlaceHolder={"Search Genres"}
                  renderSearchInputLeftIcon={() => {
                    return <Icon name="magnify" size={25} />;
                  }}
                  onChangeSearchInputText={(query) => searchGenres(query, setGenres)}
                />
              )}
              name="genres"
            />
            {parsedError.genres && <Errors errorMessages={parsedError.genres} />}
            <ListItem
              title={
                <Text>{
                  getValues("start_date")
                  ? dateFormat(getValues("start_date"), "fullDate")
                  : "Gig start date?"
                }
                </Text>
              }
              onPress={() => setShowDatePicker(!showDatePicker)}
              trailing={
                <IconButton
                  onPress={() => setShowDatePicker(!showDatePicker)}
                  icon={<Icon name="calendar" size={25}/>}
                />
              }
            />
            {parsedError.start_date && <Errors errorMessages={parsedError.start_date} />}
            <CalendarModal
              visible={showDatePicker}
              date={getValues("start_date")}
              setDate={setDate}
              onRequestClose={() => setShowDatePicker(false)}
            />
            <ListItem
              title={<Text>{"I have a spare ticket"}</Text>}
              onPress={() => {
                const newValue = !hasSpareTicket;
                setHasSpareTicket(newValue);
                setValue("has_spare_ticket", newValue);
              }}
              trailing={hasSpareTicket ? <Icon name="thumb-up-outline" size={20}/> : null}
            />
            {parsedError.has_spare_ticket && <Errors errorMessages={parsedError.has_spare_ticket} />}
          </View>
        </ScrollView>
        <View style={styles.buttonsContainer}>
          <Button
            title={"close"}
            onPress={() => setShowAddGig(false)}
            style={styles.closeButton}
          />
          <Button
            title={"submit"}
            onPress={handleSubmit(onSubmit)}
            style={styles.submitButton}
          />
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    padding: 15,
    alignSelf: "center",
    justifyContent: "center",
    marginRight: 50,
    marginLeft: 50,
    borderWidth: 1,
    borderColor: "gray",
    borderStyle: "solid",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    elevation: 5,
  },
  title: {
    fontSize: 16,
    textAlign: "center",
  },
  formContainer: {
    marginTop: 20,
    overflow: "scroll",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "70%",
    marginTop: 40,
    marginLeft: "auto",
    marginRight: "auto",
  },
  closeButton: {
    width: 100,
  },
  submitButton: {
    width: 100,
  },
  dropdownButton: {
    marginTop: 1,
    width: "100%",
    backgroundColor: "#F5F5F5",
    borderBottomWidth: 1,
    borderBottomColor: "#949494",
    minHeight: 56,
  },
  dropdownButtonText: {
    fontSize: 16,
    textAlign: "left",
  },
  dropdownSearchInputStyleStyle: {
    backgroundColor: '#EFEFEF',
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  dropdownRowTextStyle: {
    fontSize: 16,
  },
});

export default AddGigModal;
