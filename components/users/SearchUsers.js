import {Button, IconButton, Text, ListItem} from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import {StyleSheet, View} from "react-native";
import {useState} from "react";
import {BACKEND_ENDPOINTS} from "../../settings";
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
    hasActiveGigs,
    setHasActiveGigs,
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
          title={<Text>{"Has active gigs?"}</Text>}
          onPress={() => setHasActiveGigs(!hasActiveGigs)}
          trailing={
            hasActiveGigs ? (
              <Icon name="thumb-up-outline" size={20} color={theme.palette.secondary.main}/>
            ) : (
              <Icon name="thumb-down-outline" size={20} color={"grey"}/>
            )
          }
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
      </View>
    </CenteredModalWithTwoButton>
  )
}

function SearchUsers(props) {
  const {
    user,
    advancedSearch,
    setAdvancedSearch,
    getUsersFromAPI,
    searchFeedback,
    setSearchFeedback,
    resetResults,
    theme,
  } = props;

  const [searchString, setSearchString] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [hasActiveGigs, setHasActiveGigs] = useState(false);

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
    if (hasActiveGigs) {
      search += "&has_active_gigs=true"
      searchFeedBack += "has active gigs, "
    }
    if (showFavorites) {
      search += "&is_favorite=true"
      searchFeedBack += "my favorites, "
    }
    getUsersFromAPI(BACKEND_ENDPOINTS.searchUsers + "?q=" + search, true);
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
          <TextTicker style={{color: theme.palette.secondary.main, ...styles.feedback}}>
            {searchFeedback}
          </TextTicker>
          <LittleRedCloseButton action={resetResults} style={{paddingTop: 7, paddingLeft: 5}} />
        </View>
      ) : null}
      <AdvancedSearchModal
        user={user}
        setSearchString={setSearchString}
        advancedSearch={advancedSearch}
        setAdvancedSearch={setAdvancedSearch}
        showFavorites={showFavorites}
        hasActiveGigs={hasActiveGigs}
        setHasActiveGigs={setHasActiveGigs}
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
