import {FlatList, SafeAreaView, StyleSheet, View} from "react-native";
import React, {useEffect, useRef, useState} from "react";
import ShowGig from "./ShowGig";
import {BACKEND_ENDPOINTS} from "../../settings";
import SearchGigs from "./SearchGigs";
import AddGigButton from "./AddGigButton";
import {IconButton, Text, useTheme} from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import useGigsStore from "../../store/gigs";
import Errors from "../forms/Errors";
import Loading from "../loading/Loading";
import LoadingModal from "../loading/LoadingModal";

function ShowGigs({ navigation }) {
  const theme = useTheme()
  const resultsListViewRef = useRef();
  const [searchFeedback, setSearchFeedback] = useState(null);
  const [advancedSearch, setAdvancedSearch] = useState(false);
  const [loadingNext, setLoadingNext] = useState(false);
  const {object: gigs, error, loading, get, clear} = useGigsStore();

  async function getGigsFromAPI(url=BACKEND_ENDPOINTS.gigs, doNotMergeResults=false) {
    if (url.includes("/api/")) {
      setSearchFeedback(null);
    }
    if (gigs) {
      await get(url, gigs.results, doNotMergeResults);
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
  useEffect(() => {getGigsFromAPI()}, []);

  async function getNextPage() {
    if (gigs.next) {
      setLoadingNext(true);
      await getGigsFromAPI(gigs.next);
      setLoadingNext(false);
    }
  }

  async function resetResults() {
    setSearchFeedback(null);
    clear();
    await get(BACKEND_ENDPOINTS.gigs, [], true);
  }

  const parsedError = error || {};
  return (
    <>
      {!loading ? (
        <SearchGigs
          showDefaultSearchBar={false}
          advancedSearch={advancedSearch}
          setAdvancedSearch={setAdvancedSearch}
          getGigsFromAPI={getGigsFromAPI}
          searchFeedback={searchFeedback}
          setSearchFeedback={setSearchFeedback}
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
      {gigs && gigs.results.length ? (
        <SafeAreaView style={styles.container}>
          <FlatList
            ref={resultsListViewRef}
            // https://reactnative.dev/docs/optimizing-flatlist-configuration
            // removeClippedSubviews={true}
            data={gigs.results}
            refreshing={loading}
            onRefresh={resetResults}
            renderItem={({item}) => <ShowGig gig={item} theme={theme} navigation={navigation} />}
            keyExtractor={item => item.id}
            onEndReached={() => getNextPage()}
          />
        </SafeAreaView>
      ) : (
        !loading ? (
          <View style={styles.noGigsFoundContainer}>
            <Text>{"Sorry no gigs found "}</Text>
            <Icon name="emoticon-sad" size={25} color={theme.palette.secondary.main}/>
          </View>
        ) : null
      )}
      <LoadingModal isLoading={loading && !loadingNext} />
      <Loading isLoading={loading && loadingNext} />
      {!loading ? <AddGigButton navigation={navigation} theme={theme} /> : null}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    alignItems: "stretch",
    justifyContent: "flex-start",
  },
  advancedSearchButton: {
    position: "absolute",
    top: 5,
    right: 15,
    zIndex: 2,
  },
  noGigsFoundContainer: {
    height: "80%",
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ShowGigs;
