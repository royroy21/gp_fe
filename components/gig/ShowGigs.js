import {FlatList, SafeAreaView, StyleSheet, Text} from "react-native";
import React, {useEffect, useState} from "react";
import getGigs from "./getGigs";
import ShowGig from "./ShowGig";
import Loading from "../forms/Loading";
import {BACKEND_ENDPOINTS} from "../../settings";

function ShowGigs() {
  const [loading, setLoading] = useState(false);
  const [gigs, setGigs] = useState({results: []});

  async function getGigsFromAPI(url=BACKEND_ENDPOINTS.gigs) {
    setLoading(true);
    await getGigs(url, setGigs, gigs.results);
    setLoading(false);
  }
  useEffect(() => {getGigsFromAPI()}, []);

  async function getNextPage() {
    if (gigs.next) {
      await getGigsFromAPI(gigs.next)
    }
  }

  return (
    <>
      <Loading isLoading={loading} />
      {gigs.results.length ? (
        <SafeAreaView style={styles.container}>
          <FlatList
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
  }
});

export default ShowGigs;
