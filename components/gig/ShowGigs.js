import {FlatList, SafeAreaView, StyleSheet, Text, View} from "react-native";
import React, {useEffect, useRef, useState} from "react";
import ShowGig from "./ShowGig";
import {BACKEND_ENDPOINTS} from "../../settings";
import SearchGigs from "./SearchGigs";
import AddGigButton from "./AddGigButton";
import LoadingModal from "../loading/LoadingModal";
import {useTheme} from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import useGigsStore from "../../store/gigs";
import Errors from "../forms/Errors";

function ShowGigs({ navigation }) {
  const theme = useTheme()
  const resultsListViewRef = useRef();
  const [searchFeedback, setSearchFeedback] = useState(null);
  const {object: gigs, error, loading, get} = useGigsStore();

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
  }
  useEffect(() => {getGigsFromAPI()}, []);

  async function getNextPage() {
    if (gigs.next) {
      await getGigsFromAPI(gigs.next)
    }
  }

  const parsedError = error || {};
  return (
    <>
      <LoadingModal isLoading={loading}/>
      {!loading ? (
        <SearchGigs
          getGigsFromAPI={getGigsFromAPI}
          searchFeedback={searchFeedback}
          setSearchFeedback={setSearchFeedback}
        />
      ) : null}
      {(parsedError.detail) && <Errors errorMessages={parsedError.detail} />}
      {(parsedError.unExpectedError) && <Errors errorMessages={parsedError.unExpectedError} />}
      {gigs && gigs.results.length ? (
        <SafeAreaView style={styles.container}>
          <FlatList
            ref={resultsListViewRef}
            // https://reactnative.dev/docs/optimizing-flatlist-configuration
            removeClippedSubviews={true}
            data={gigs.results}
            renderItem={({item}) => <ShowGig gig={item} theme={theme} navigation={navigation} />}
            keyExtractor={item => item.id}
            onEndReached={() => getNextPage()}
          />
        </SafeAreaView>
      ) : (
        <View style={styles.noGigsFoundContainer}>
          <Text>{!loading ? "Sorry no gigs found " : null}</Text>
          <Icon name="emoticon-sad" size={25}/>
        </View>
      )}
      {!loading ? <AddGigButton buttonStyle={styles.addGigButton} navigation={navigation} /> : null}
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
  searchFeedback: {
    width: "95%",
  },
  noGigsFoundContainer: {
    height: "80%",
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  }
});

export default ShowGigs;
