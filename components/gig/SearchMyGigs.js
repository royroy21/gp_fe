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
    setSearchString,
    advancedSearch,
    setAdvancedSearch,
    withReplies,
    setWithReplies,
    showPastGigs,
    setShowPastGigs,
    lookingForGigPig,
    setLookingForGigPig,
    isFreeGig,
    setIsFreeGig,
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
        <ListItem
          title={<Text>{"With replies?"}</Text>}
          onPress={() => setWithReplies(!withReplies)}
          trailing={
            withReplies ? (
              <Icon name="thumb-up-outline" size={20} color={theme.palette.secondary.main}/>
            ) : (
              <Icon name="thumb-down-outline" size={20} color={"grey"}/>
            )
          }
        />
        <ListItem
          title={<Text>{"Show past gigs?"}</Text>}
          onPress={() => setShowPastGigs(!showPastGigs)}
          trailing={
            showPastGigs ? (
              <Icon name="thumb-up-outline" size={20} color={theme.palette.secondary.main}/>
            ) : (
              <Icon name="thumb-down-outline" size={20} color={"grey"}/>
            )
          }
        />
        <ListItem
          title={<Text>{"Looking for a GigPig?"}</Text>}
          onPress={() => setLookingForGigPig(!lookingForGigPig)}
          trailing={
            lookingForGigPig ? (
              <Icon name="thumb-up-outline" size={20} color={theme.palette.secondary.main}/>
            ) : (
              <Icon name="thumb-down-outline" size={20} color={"grey"}/>
            )
          }
        />
        <ListItem
          title={<Text>{"Is a free Gig?"}</Text>}
          onPress={() => setIsFreeGig(!isFreeGig)}
          trailing={
            isFreeGig ? (
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

function SearchMyGigs(props) {
  const {
    advancedSearch,
    setAdvancedSearch,
    getGigsFromAPI,
    searchFeedback,
    setSearchFeedback,
    resetResults,
    theme,
  } = props;

  const [searchString, setSearchString] = useState("");
  const [withReplies, setWithReplies] = useState(false);
  const [showPastGigs, setShowPastGigs] = useState(false);
  const [lookingForGigPig, setLookingForGigPig] = useState(false);
  const [isFreeGig, setIsFreeGig] = useState(false);
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
    if (withReplies) {
      search += "&has_replies=true"
      searchFeedBack += "with replies, "
    }
    if (showPastGigs) {
      search += "&past_gigs=true"
      searchFeedBack += "show past gigs, "
    }
    if (lookingForGigPig) {
      search += "&looking_for_gigpig=true"
      searchFeedBack += "looking for gigpig, "
    }
    if (isFreeGig) {
      search += "&is_free_gig=true"
      searchFeedBack += "is free gig, "
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
        setSearchString={setSearchString}
        advancedSearch={advancedSearch}
        setAdvancedSearch={setAdvancedSearch}
        withReplies={withReplies}
        setWithReplies={setWithReplies}
        showPastGigs={showPastGigs}
        setShowPastGigs={setShowPastGigs}
        lookingForGigPig={lookingForGigPig}
        setLookingForGigPig={setLookingForGigPig}
        isFreeGig={isFreeGig}
        setIsFreeGig={setIsFreeGig}
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

export default SearchMyGigs;
