import {FlatList, SafeAreaView, StyleSheet, Text} from "react-native";
import React, {useEffect, useRef, useState} from "react";
import getGigs from "./getGigs";
import ShowGig from "./ShowGig";
import Loading from "../forms/Loading";
import {BACKEND_ENDPOINTS} from "../../settings";
import SearchGigs from "./SearchGigs";

function ShowGigs() {
  const resultsListViewRef = useRef();

  const [loading, setLoading] = useState(false);
  const [gigs, setGigs] = useState({results: []});
  const [searchFeedback, setSearchFeedback] = useState(null);

  async function getGigsFromAPI(url=BACKEND_ENDPOINTS.gigs, doNotMergeResults=false) {
    if (url.includes("/api/")) {
      setSearchFeedback(null);
    }
    setLoading(true);
    await getGigs(url, setGigs, gigs.results, doNotMergeResults);
    setLoading(false);
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

  return (
    <>
      <Loading isLoading={loading}/>
      {!loading ? (
        <SearchGigs
          getGigsFromAPI={getGigsFromAPI}
          searchFeedback={searchFeedback}
          setSearchFeedback={setSearchFeedback}
        />
      ) : null}
      {gigs.results.length ? (
        <SafeAreaView style={styles.container}>
          <FlatList
            ref={resultsListViewRef}
            data={gigs.results}
            renderItem={({item}) => <ShowGig gig={item}/>}
            keyExtractor={item => item.id}
            onEndReached={() => getNextPage()}
          />
        </SafeAreaView>
      ) : (
        <Text>{!loading ? "Sorry no gigs found :(" : null}</Text>
      )}
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
  }
});

export default ShowGigs;
