import {Button, IconButton, Text, ListItem} from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import {StyleSheet, View} from "react-native";
import {useState} from "react";
import {BACKEND_ENDPOINTS} from "../../settings";
import CenteredModalWithTwoButton from "../centeredModal/CenteredModalWithTwoButtons";
import TextInput from "../forms/TextInput";
import TextTicker from "../Text/TextTicker";
import LittleRedCloseButton from "../buttons/LittleRedCloseButton";

function AdvancedSearchModel(props) {
  const {
    setSearchString,
    advancedSearch,
    setAdvancedSearch,
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
      </View>
    </CenteredModalWithTwoButton>
  )
}

function SearchRooms(props) {
  const {
    advancedSearch,
    setAdvancedSearch,
    getRoomsFromAPI,
    searchFeedback,
    setSearchFeedback,
    resetResults,
    theme,
  } = props;

  const [searchString, setSearchString] = useState("");

  function submitSearchRequest() {
    // If searchString is empty send query to return all results
    let searchFeedBack = "Showing results for ";
    const getAllQuery = "";
    let search = (searchString.trim() === "") ? getAllQuery : searchString;
    if (search) {
      searchFeedBack += `${search}, `;
    }
    getRoomsFromAPI(BACKEND_ENDPOINTS.searchRooms + "?q=" + search, true);
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
      <AdvancedSearchModel
        setSearchString={setSearchString}
        advancedSearch={advancedSearch}
        setAdvancedSearch={setAdvancedSearch}
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

export default SearchRooms;
