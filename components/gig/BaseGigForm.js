import {Dimensions, ScrollView, StyleSheet, Text, View} from "react-native";
import LoadingModal from "../loading/LoadingModal";
import Errors from "../forms/Errors";
import {Controller} from "react-hook-form";
import TextInput from "../forms/TextInput";
import SelectDropdown from "react-native-select-dropdown";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import DisplayGenres from "./DisplayGenres";
import {Button, IconButton, ListItem} from "@react-native-material/core";
import dateFormat from "dateformat";
import CalendarModal from "../calendar";
import useCountriesStore from "../../store/countries";
import useGenresStore from "../../store/genres";

function BaseGigForm(props) {
  const {
    navigation,
    control,
    handleSubmit,
    getValues,
    setValue,
    loading,
    error,
    numberOfGenres,
    setNumberOfGenres,
    showDatePicker,
    setShowDatePicker,
    hasSpareTicket,
    setHasSpareTicket,
    onSubmit,
    loadingCountry=false,
  } = props;

  const windowHeight = Dimensions.get("window").height;

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

  const parsedError = error || {};
  return (
    <View style={styles.container}>
      <View style={{height: Math.round(windowHeight * 0.8), ...styles.dataContainer}}>
        <LoadingModal isLoading={loading || loadingCountry} />
        <CalendarModal
          visible={showDatePicker}
          date={getValues("start_date")}
          setDate={setDate}
          onRequestClose={() => setShowDatePicker(false)}
        />
        <ScrollView>
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
                  defaultValue={value}
                  onSelect={(selectedItem) => {
                    onChange(selectedItem);
                  }}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return `country: ${selectedItem.country}`;
                  }}
                  rowTextForSelection={(item, index) => {
                    return `${item.country} (${item.code})`
                  }}
                  defaultButtonText={`country: ${value ? value.country : ""}`}
                  buttonStyle={styles.dropdownButton}
                  buttonTextStyle={styles.dropdownButtonText}
                  rowTextStyle={styles.dropdownRowTextStyle}
                  search={true}
                  searchInputStyle={styles.dropdownSearchInputStyleStyle}
                  searchPlaceHolder={"Search Country"}
                  renderSearchInputLeftIcon={() => {
                    return <Icon name="magnify" size={25} />;
                  }}
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
                  onChangeSearchInputText={(query) => searchGenres(query)}
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
                  : "gig start date?"
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
            <ListItem
              title={
                <Text>
                  {"I have a spare ticket"}
                </Text>
              }
              onPress={() => {
                const newValue = !hasSpareTicket;
                setHasSpareTicket(newValue);
                setValue("has_spare_ticket", newValue);
              }}
              trailing={getValues("has_spare_ticket") ? <Icon name="thumb-up-outline" size={25}/> : null}
            />
            {parsedError.has_spare_ticket && <Errors errorMessages={parsedError.has_spare_ticket} />}
          </View>
        </ScrollView>
        <View style={styles.buttonsContainer}>
          <Button
            title={"cancel"}
            onPress={() => navigation.goBack()}
            style={styles.closeButton}
          />
          <Button
            title={"submit"}
            onPress={handleSubmit(onSubmit)}
            style={styles.submitButton}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
  dataContainer: {
    margin: 15,
  },
  formContainer: {
    marginTop: 20,
    marginBottom: 20,
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
  }
});

export default BaseGigForm;
