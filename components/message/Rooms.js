import React, {useCallback, useState} from "react";
import useRoomsStore from "../../store/rooms";
import Errors from "../forms/Errors";
import {Dimensions, FlatList, SafeAreaView, StyleSheet, View} from "react-native";
import {Text, useTheme} from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import LoadingModal from "../loading/LoadingModal";
import Loading from "../loading/Loading";
import RoomDetail from "./RoomDetail";
import {useFocusEffect} from "@react-navigation/native";
import {BACKEND_ENDPOINTS} from "../../settings";
import unreadMessagesStore from "../../store/unreadMessages";

const countUnreadMessages = (roomId, unreadMessages) => {
  let count = 0;
  unreadMessages.forEach(item => {
    if (item === roomId) {
      count += 1;
    }
  })
  return count;
}

function Rooms({ navigation }) {
  const theme = useTheme()
  const {unreadMessages} = unreadMessagesStore();
  const [loadingNext, setLoadingNext] = useState(false);
  const windowWidth = Dimensions.get("window").width;
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
    <View style={styles.container}>
      {(parsedError.detail) && <Errors errorMessages={parsedError.detail} />}
      {(parsedError.unExpectedError) && <Errors errorMessages={parsedError.unExpectedError} />}
      {rooms && rooms.results.length ? (
        <SafeAreaView style={styles.listContainer}>
          <FlatList
            data={rooms.results}
            refreshing={loading}
            onRefresh={resetResults}
            renderItem={({item}) => {
              const unreadMessagesCount = countUnreadMessages(item.id, unreadMessages);
              return (
                <RoomDetail
                  room={item}
                  windowWidth={windowWidth}
                  theme={theme}
                  navigation={navigation}
                  unReadMessagesCount={unreadMessagesCount}
              />
              )
            }}
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
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    // TODO - will need to uncomment this when message search is added.
    // flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
  },
  listContainer: {
    width: "100%",
    alignItems: "stretch",
    justifyContent: "flex-start",
  },
  noRoomsFoundContainer: {
    height: "80%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  }
});

export default Rooms;
