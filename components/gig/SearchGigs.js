import {Button, IconButton, ListItem, Switch, TextInput} from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import {StyleSheet, Text, View} from "react-native";
import {useState} from "react";
import {BACKEND_ENDPOINTS} from "../../settings";
import dateFormat from "dateformat";
import CalendarModal from "../calendar";

function SearchGigs({getGigsFromAPI, searchFeedback, setSearchFeedback}) {
  const [searchString, setSearchString] = useState("");
  const [advancedSearch, setAdvancedSearch] = useState(false);
  const [showMyGigs, setShowMyGigs] = useState(false);
  const [hasSpareTicket, setHasSpareTicket] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  function submitSearchRequest() {
    // If searchString is empty send query to return all results
    let searchFeedBack = "Showing results for ";
    const getAllQuery = "*:*";
    let search = (searchString.trim() === "") ? getAllQuery : searchString;
    if (search === getAllQuery) {
      searchFeedBack += `everything, `;
    } else {
      searchFeedBack += `${search}, `;
    }
    if (showMyGigs) {
      search += "&my_gigs=true"
      searchFeedBack += "my gigs, "
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
    getGigsFromAPI(BACKEND_ENDPOINTS.searchGigs + "?search=" + search, true);

    searchFeedBack = searchFeedBack.trim()
    if (searchFeedBack[searchFeedBack.length - 1] === ",") {
      searchFeedBack = searchFeedBack.slice(0, searchFeedBack.length - 1)
    }
    setSearchFeedback(searchFeedBack)
  }

  return (
    <View style={styles.container}>
      <TextInput
        variant={"outlined"}
        trailing={
          <IconButton
            icon={<Icon name="magnify" size={25} />}
            onPress={submitSearchRequest}
          />
        }
        onChangeText={setSearchString}
      />
      <View style={{flexDirection: "row"}}>
        <Text style={styles.feedback}>{searchFeedback || ""}</Text>
        <IconButton
          icon={<Icon name="chevron-down" size={25} />}
          onPress={() => setAdvancedSearch(!advancedSearch)}
        />
      </View>
      {advancedSearch ? (
        <View style={styles.advancedSearch}>
          <View>
            <ListItem
              title={<Text>{"Show my gigs only?"}</Text>}
              trailing={
                <Switch value={showMyGigs} onValueChange={() => setShowMyGigs(!showMyGigs)}/>
              }
            />
            <ListItem
              title={<Text>{"Has spare ticket?"}</Text>}
              trailing={
                <Switch value={hasSpareTicket} onValueChange={() => setHasSpareTicket(!hasSpareTicket)}/>
              }
            />
            <ListItem
              title={<Text>{startDate ? dateFormat(startDate, "fullDate") : "Gig start date?"}</Text>}
              trailing={
                <IconButton
                  onPress={() => setShowDatePicker(!showDatePicker)}
                  icon={<Icon name="calendar" size={25}/>}
                />
              }
            />
          </View>
        </View>
      ) : null }
      <CalendarModal
        visible={showDatePicker}
        date={startDate}
        setDate={setStartDate}
        onRequestClose={() => setShowDatePicker(false)}
      />
      {advancedSearch ? (
        <View style={styles.searchButtonContainer}>
          <Button
            style={styles.searchButton}
            title={"Search"}
            onPress={submitSearchRequest}
          />
        </View>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "98%",
    marginTop: 10,
    marginBottom: 10,
  },
  advancedSearch: {
    marginTop: 15,
    marginBottom: 40,
    marginLeft: 10,
    marginRight: 10,
  },
  listItem: {
    marginBottom: 10,
  },
  searchButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  searchButton: {
    width: "40%",
    marginBottom: 25,
  },
  feedback: {
    marginTop: 15,
    marginLeft: 5,
    marginBottom: 5,
    width: "87%",
  },
});

export default SearchGigs;
