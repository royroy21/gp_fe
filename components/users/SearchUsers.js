import {Button, IconButton, Text, ListItem} from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import {StyleSheet, View} from "react-native";
import {useState} from "react";
import {BACKEND_ENDPOINTS} from "../../settings";
import CenteredModalWithTwoButton from "../centeredModal/CenteredModalWithTwoButtons";
import TextInput from "../forms/TextInput";
import TextTicker from "../Text/TextTicker";

function AdvancedSearchModel(props) {
  const {
    setSearchString,
    advancedSearch,
    setAdvancedSearch,
    showFavorites,
    setShowFavorites,
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
      </View>
    </CenteredModalWithTwoButton>
  )
}

function SearchUsers(props) {
  const {
    advancedSearch,
    setAdvancedSearch,
    getUsersFromAPI,
    searchFeedback,
    setSearchFeedback,
    theme,
  } = props;

  const [searchString, setSearchString] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);

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
    if (showFavorites) {
      search += "&is_favorite=true"
      searchFeedBack += "my favorites, "
    }
    getUsersFromAPI(BACKEND_ENDPOINTS.searchUsers + "?search=" + search, true);
    searchFeedBack = searchFeedBack.trim()
    if (searchFeedBack[searchFeedBack.length - 1] === ",") {
      searchFeedBack = searchFeedBack.slice(0, searchFeedBack.length - 1)
    }
    setSearchFeedback(searchFeedBack)
  }

  return (
    <View>
      {searchFeedback ? (
        <TextTicker style={{color: theme.palette.secondary.main, ...styles.feedback}}>
          {searchFeedback}
        </TextTicker>
      ) : null}
      <AdvancedSearchModel
        setSearchString={setSearchString}
        advancedSearch={advancedSearch}
        setAdvancedSearch={setAdvancedSearch}
        showFavorites={showFavorites}
        setShowFavorites={setShowFavorites}
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

export default SearchUsers;
