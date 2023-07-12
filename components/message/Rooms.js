import React, {useCallback, useState} from "react";
import useRoomsStore from "../../store/rooms";
import Errors from "../forms/Errors";
import {FlatList, SafeAreaView, StyleSheet, View} from "react-native";
import {Text, useTheme} from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import LoadingModal from "../loading/LoadingModal";
import Loading from "../loading/Loading";
import RoomDetail from "./RoomDetail";
import {useFocusEffect} from "@react-navigation/native";
import {BACKEND_ENDPOINTS} from "../../settings";

function Rooms({ navigation }) {
  const theme = useTheme()
  const [loadingNext, setLoadingNext] = useState(false);
  const {object: rooms, error, loading, get, clear} = useRoomsStore();

  async function getRoomsFromAPI(url=BACKEND_ENDPOINTS.room) {
    if (rooms) {
      await get(url, rooms.results);
    } else {
      await get(url, []);
    }
  }

  useFocusEffect(
    useCallback(() => {
      getRoomsFromAPI();
      return () => {
        clear();
      };
    }, [])
  );

  async function getNextPage() {
    if (rooms.next) {
      setLoadingNext(true);
      await getRoomsFromAPI(rooms.next);
      setLoadingNext(false);
    }
  }

  async function resetResults() {
    clear();
    await get(BACKEND_ENDPOINTS.room, []);
  }

  const parsedError = error || {};
  return (
    <>
      {(parsedError.detail) && <Errors errorMessages={parsedError.detail} />}
      {(parsedError.unExpectedError) && <Errors errorMessages={parsedError.unExpectedError} />}
      {rooms && rooms.results.length ? (
        <SafeAreaView style={styles.container}>
          <FlatList
            data={rooms.results}
            refreshing={loading}
            onRefresh={resetResults}
            renderItem={({item}) => <RoomDetail room={item} theme={theme} navigation={navigation}/>}
            keyExtractor={item => item.id}
            onEndReached={() => getNextPage()}
          />
        </SafeAreaView>
      ) : (
        !loading ? (
          <View style={styles.noRoomsFoundContainer}>
            <Text>{"No messages yet "}</Text>
            <Icon name="emoticon-confused" size={25} color={theme.palette.secondary.main}/>
          </View>
        ) : null
      )}
      <LoadingModal isLoading={loading && !loadingNext} />
      <Loading isLoading={loading && loadingNext} />
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
  noRoomsFoundContainer: {
    height: "80%",
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  }
});

export default Rooms;
