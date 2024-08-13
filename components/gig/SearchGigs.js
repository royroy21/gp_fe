import {Button, IconButton, ListItem, Text} from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import {StyleSheet, View} from "react-native";
import {useState} from "react";
import {BACKEND_ENDPOINTS} from "../../settings";
import dateFormat from "dateformat";
import CalendarModal from "../calendar";
import CenteredModalWithTwoButton from "../centeredModal/CenteredModalWithTwoButtons";
import TextInput from "../forms/TextInput";
import TextTicker from "../Text/TextTicker";
import LittleRedCloseButton from "../buttons/LittleRedCloseButton";

function AdvancedSearchModal(props) {
  const {
    user,
    setSearchString,
    advancedSearch,
    setAdvancedSearch,
    showFavorites,
    setShowFavorites,
    hasSpareTicket,
    setHasSpareTicket,
    startDate,
    setStartDate,
    setShowDatePicker,
    showDatePicker,
    submitSearchRequest,
    theme,
  } = props

  return (
    <CenteredModalWithTwoButton
      showModal={advancedSearch}
      setModal={setAdvancedSearch}
      actionButton={
        <Button
          title={"Search"}
          onPress={submitSearchRequest}
        />
      }
    >
      <CalendarModal
        visible={showDatePicker}
        date={startDate}
        setDate={setStartDate}
        onRequestClose={() => setShowDatePicker(false)}
      />
      <View style={styles.searchOptions}>
        <TextInput
          variant={"outlined"}
          trailing={
            <IconButton
              icon={<Icon name="magnify" size={25} color={theme.palette.secondary.main}/>}
              onPress={submitSearchRequest}
            />
          }
          onChangeText={setSearchString}
        />
        {user ? (
          <ListItem
            title={<Text>{"Favorites?"}</Text>}
            onPress={() => setShowFavorites(!showFavorites)}
            trailing={
              showFavorites ? (
                <Icon name="thumb-up-outline" size={20} color={theme.palette.secondary.main}/>
              ) : (
                <Icon name="thumb-down-outline" size={20} color={"grey"}/>
              )
            }
          />
        ) : null}
        <ListItem
          title={<Text>{"Has spare ticket?"}</Text>}
          onPress={() => setHasSpareTicket(!hasSpareTicket)}
          trailing={
            hasSpareTicket ? (
              <Icon name="thumb-up-outline" size={20} color={theme.palette.secondary.main}/>
            ) : (
              <Icon name="thumb-down-outline" size={20} color={"grey"}/>
            )
          }
        />
        <ListItem
          title={<Text>{startDate ? dateFormat(startDate, "fullDate") : "Gig start date?"}</Text>}
          onPress={() => setShowDatePicker(!showDatePicker)}
          trailing={
            <IconButton
              onPress={() => setShowDatePicker(!showDatePicker)}
              icon={<Icon name="calendar" size={25} color={theme.palette.secondary.main}/>}
            />
          }
        />
      </View>
    </CenteredModalWithTwoButton>
  )
}

function SearchGigs(props) {
  const {
    user,
    advancedSearch,
    setAdvancedSearch,
    getGigsFromAPI,
    searchFeedback,
    setSearchFeedback,
    resetResults,
    theme,
  } = props;

  const [searchString, setSearchString] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [hasSpareTicket, setHasSpareTicket] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  function submitSearchRequest() {
    // If searchString is empty send query to return all results
    let searchFeedBack = "Showing results for ";
    const getAllQuery = "";
    let search = (searchString.trim() === "") ? getAllQuery : searchString;
    if (search === getAllQuery) {
      searchFeedBack += `everything, `;
    } else {
      searchFeedBack += `${search}, `;
    }
    if (showFavorites) {
      search += "&is_favorite=true"
      searchFeedBack += "my favorites, "
    }
    if (hasSpareTicket) {
      search += "&has_spare_ticket=true"
      searchFeedBack += "has a spare ticket, "
    }
    if (startDate) {
      const formattedDate = dateFormat(startDate, "isoDate");
      search += "&start_date__gte=" + formattedDate + "&order_by=start_date";
      searchFeedBack += `starting on ${dateFormat(startDate, "fullDate")}`;
    }
    getGigsFromAPI(BACKEND_ENDPOINTS.searchGigs + "?q=" + search, true);

    searchFeedBack = searchFeedBack.trim()
    if (searchFeedBack[searchFeedBack.length - 1] === ",") {
      searchFeedBack = searchFeedBack.slice(0, searchFeedBack.length - 1)
    }
    setSearchFeedback(searchFeedBack)
  }

  return (
    <View>
      {searchFeedback ? (
        <View style={{ flexDirection: "row" }}>
          <LittleRedCloseButton action={resetResults} style={{paddingTop: 7, paddingLeft: 5}} />
          <TextTicker style={{color: theme.palette.secondary.main, ...styles.feedback}}>
            {searchFeedback}
          </TextTicker>
        </View>
      ) : null}
      <AdvancedSearchModal
        user={user}
        setSearchString={setSearchString}
        advancedSearch={advancedSearch}
        setAdvancedSearch={setAdvancedSearch}
        showFavorites={showFavorites}
        setShowFavorites={setShowFavorites}
        hasSpareTicket={hasSpareTicket}
        setHasSpareTicket={setHasSpareTicket}
        startDate={startDate}
        setStartDate={setStartDate}
        setShowDatePicker={setShowDatePicker}
        showDatePicker={showDatePicker}
        submitSearchRequest={submitSearchRequest}
        theme={theme}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  searchOptions: {
    marginBottom: 25,
  },
  feedback: {
    fontSize: 14,
    marginTop: 15,
    marginLeft: 5,
    marginBottom: 5,
    width: "87%",
  },
});

export default SearchGigs;
