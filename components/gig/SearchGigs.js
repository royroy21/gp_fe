import {Button, IconButton, ListItem, TextInput, useTheme, Text} from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import {Dimensions, Modal, StyleSheet, View} from "react-native";
import {useState} from "react";
import {BACKEND_ENDPOINTS} from "../../settings";
import dateFormat from "dateformat";
import CalendarModal from "../calendar";

function AdvancedSearchModel(props) {
  const {
    setSearchString,
    advancedSearch,
    setAdvancedSearch,
    showMyGigs,
    setShowMyGigs,
    hasSpareTicket,
    setHasSpareTicket,
    startDate,
    setStartDate,
    setShowDatePicker,
    showDatePicker,
    submitSearchRequest,
    theme,
  } = props
  const windowHeight = Dimensions.get('window').height;
  const windowWidth = Dimensions.get('window').width;

  return (
    <Modal
      animationType={"slide"}
      transparent={true}
      visible={advancedSearch}
      onRequestClose={() => setAdvancedSearch(false)}
    >
      <View style={{
        backgroundColor: theme.palette.background.main,
        borderWidth: 1,
        borderColor: "gray",
        borderStyle: "solid",
        marginTop: Math.round(windowHeight * 0.2),
        width: Math.round(windowWidth * 0.9),
        ...styles.modelContainer,
      }}>
        <View style={styles.advancedSearch}>
          <Text style={styles.title}>{"Advanced Search"}</Text>
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
          <View>
            <ListItem
              title={<Text>{"Show my gigs only?"}</Text>}
              onPress={() => setShowMyGigs(!showMyGigs)}
              trailing={
                showMyGigs ? (
                  <Icon name="thumb-up-outline" size={20} color={theme.palette.secondary.main}/>
                ) : null
              }
            />
            <ListItem
              title={<Text>{"Has spare ticket?"}</Text>}
              onPress={() => setHasSpareTicket(!hasSpareTicket)}
              trailing={
                hasSpareTicket ? (
                  <Icon name="thumb-up-outline" size={20} color={theme.palette.secondary.main}/>
                ) : null
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
        </View>
        <CalendarModal
          visible={showDatePicker}
          date={startDate}
          setDate={setStartDate}
          onRequestClose={() => setShowDatePicker(false)}
        />
        <View style={styles.searchButtonContainer}>
          <Button
            title={"close"}
            onPress={() => setAdvancedSearch(false)}
            style={styles.closeButton}
          />
          <Button
            style={styles.searchButton}
            title={"Search"}
            onPress={submitSearchRequest}
          />
        </View>
      </View>
    </Modal>
  )
}

function SearchGigs({getGigsFromAPI, searchFeedback, setSearchFeedback}) {
  const [searchString, setSearchString] = useState("");
  const [advancedSearch, setAdvancedSearch] = useState(false);
  const [showMyGigs, setShowMyGigs] = useState(false);
  const [hasSpareTicket, setHasSpareTicket] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const theme = useTheme()

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
            icon={<Icon name="magnify" size={25} color={theme.palette.secondary.main}/>}
            onPress={submitSearchRequest}
          />
        }
        onChangeText={setSearchString}
      />
      <View style={{flexDirection: "row"}}>
        <Text style={{color: theme.palette.secondary.main, ...styles.feedback}}>
          {searchFeedback || ""}
        </Text>
        <IconButton
          icon={<Icon name="chevron-down" size={25} color={theme.palette.primary.main}/>}
          onPress={() => setAdvancedSearch(!advancedSearch)}
        />
      </View>
      <AdvancedSearchModel
        setSearchString={setSearchString}
        advancedSearch={advancedSearch}
        setAdvancedSearch={setAdvancedSearch}
        showMyGigs={showMyGigs}
        setShowMyGigs={setShowMyGigs}
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
  container: {
    width: "98%",
    marginTop: 10,
    marginBottom: 10,
  },
  modelContainer: {
    padding: 15,
    alignSelf: "center",
    justifyContent: "center",
    marginRight: 50,
    marginLeft: 50,
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
    marginBottom: 10,
  },
  advancedSearch: {
    marginTop: 15,
    marginBottom: 40,
    marginLeft: 10,
    marginRight: 10,
  },
  searchButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "70%",
    marginTop: 10,
    marginLeft: "auto",
    marginRight: "auto",
  },
  closeButton: {
    width: 100,
  },
  searchButton: {
    width: 100,
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
