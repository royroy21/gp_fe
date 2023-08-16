import {FlatList, SafeAreaView, StyleSheet, View} from "react-native";
import React, {useRef, useState} from "react";
import ShowUser from "./ShowUser";
import {BACKEND_ENDPOINTS} from "../../settings";
import {IconButton, Text, useTheme} from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import Errors from "../forms/Errors";
import Loading from "../loading/Loading";
import LoadingModal from "../loading/LoadingModal";
import {useFocusEffect} from "@react-navigation/native";
import useUsersStore from "../../store/users";
import SearchUsers from "./SearchUsers";

function ShowUsers({ navigation }) {
  const theme = useTheme()
  const resultsListViewRef = useRef();
  const [searchFeedback, setSearchFeedback] = useState(null);
  const [advancedSearch, setAdvancedSearch] = useState(false);
  const [loadingNext, setLoadingNext] = useState(false);
  const {object: users, error, loading, get, clear} = useUsersStore();

  async function getUsersFromAPI(url=BACKEND_ENDPOINTS.user, doNotMergeResults=false) {
    if (url.includes("/api/")) {
      setSearchFeedback(null);
    }
    if (users) {
      await get(url, users.results, doNotMergeResults);
    } else {
      await get(url, [], doNotMergeResults);
    }
    if (doNotMergeResults) {
      if (resultsListViewRef.current) {
        // For fresh results scroll back to top.
        resultsListViewRef.current.scrollToOffset({ offset: 0, animated: true });
      }
    }
    setAdvancedSearch(false);
  }
  useFocusEffect(
    React.useCallback(() => {
      getUsersFromAPI();
      return () => {
        setSearchFeedback(null);
        setAdvancedSearch(false);
        setLoadingNext(false);
        clear();
      };
    }, [])
  );

  async function getNextPage() {
    if (users.next) {
      setLoadingNext(true);
      await getUsersFromAPI(users.next);
      setLoadingNext(false);
    }
  }

  async function resetResults() {
    setSearchFeedback(null);
    clear();
    await get(BACKEND_ENDPOINTS.user, [], true);
  }

  const parsedError = error || {};
  return (
    <View style={styles.container}>
      {!loading ? (
        <SearchUsers
          advancedSearch={advancedSearch}
          setAdvancedSearch={setAdvancedSearch}
          getUsersFromAPI={getUsersFromAPI}
          searchFeedback={searchFeedback}
          setSearchFeedback={setSearchFeedback}
          theme={theme}
        />
      ) : null}
      <IconButton
        style={{
          ...styles.advancedSearchButton,
          backgroundColor: theme.palette.background.main,
        }}
        onPress={() => setAdvancedSearch(!advancedSearch)}
        icon={
          <Icon
            name={"magnify"}
            size={30}
            color={theme.palette.secondary.main}
          />
        }
      />
      {(parsedError.detail) && <Errors errorMessages={parsedError.detail} />}
      {(parsedError.unExpectedError) && <Errors errorMessages={parsedError.unExpectedError} />}
      {users && users.results.length ? (
        <SafeAreaView style={styles.listContainer}>
          <FlatList
            ref={resultsListViewRef}
            // https://reactnative.dev/docs/optimizing-flatlist-configuration
            // removeClippedSubviews={true}
            data={users.results}
            refreshing={loading}
            onRefresh={resetResults}
            renderItem={({item}) => <ShowUser user={item} theme={theme} navigation={navigation} />}
            keyExtractor={item => item.id}
            onEndReached={() => getNextPage()}
          />
        </SafeAreaView>
      ) : (
        !loading ? (
          <View style={styles.noUsersFoundContainer}>
            <Text>{"Sorry no users found "}</Text>
            <Icon name="emoticon-sad" size={25} color={theme.palette.secondary.main}/>
          </View>
        ) : null
      )}
      <LoadingModal isLoading={loading && !loadingNext} />
      <Loading isLoading={loading && loadingNext} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  listContainer: {
    width: "100%",
    flex: 1,
    alignItems: "stretch",
    justifyContent: "flex-start",
  },
  advancedSearchButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 2,
  },
  noUsersFoundContainer: {
    height: "80%",
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ShowUsers;
