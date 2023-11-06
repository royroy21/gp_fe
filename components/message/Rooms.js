import React, {useCallback, useRef, useState} from "react";
import useRoomsStore from "../../store/rooms";
import Errors from "../forms/Errors";
import {Dimensions, FlatList, Platform, SafeAreaView, StyleSheet, View} from "react-native";
import {Button, IconButton, Text, useTheme} from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import LoadingModal from "../loading/LoadingModal";
import Loading from "../loading/Loading";
import RoomDetail from "./RoomDetail";
import {useFocusEffect} from "@react-navigation/native";
import {BACKEND_ENDPOINTS} from "../../settings";
import unreadMessagesStore from "../../store/unreadMessages";
import {ScrollView} from "react-native-web";
import SearchRooms from "./SearchRooms";
import useRoomStore from "../../store/room";
import PleaseLoginMessage from "../loginSignUp/PleaseLoginMessage";
import useUserStore from "../../store/user";

const countUnreadMessages = (roomId, unreadMessages) => {
  let count = 0;
  unreadMessages.forEach(item => {
    if (item === roomId) {
      count += 1;
    }
  })
  return count;
}

function ListRooms(props) {
  const [showLoadMore, setShowLoadMore] = useState(false);
  const {
    isWeb,
    navigation,
    resultsListViewRef,
    rooms,
    storeRoom,
    unreadMessages,
    resetResults,
    getNextPage,
    loading,
    windowWidth,
    theme,
  } = props;
  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 2;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
  };
  const onScroll = ({nativeEvent}) => {
    if (isCloseToBottom(nativeEvent) && !loading && rooms.next) {
      setShowLoadMore(true)
    } else if (showLoadMore){
      setShowLoadMore(false);
    }
  }

  if (isWeb) {
    return (
      <>
        <ScrollView
          ref={resultsListViewRef}
          onScroll={onScroll}
          scrollEventThrottle={400}
        >
          {rooms.results.map(item => {
            const unreadMessagesCount = countUnreadMessages(item.id, unreadMessages);
            return (
              <RoomDetail
                key={item.id}
                room={item}
                storeRoom={storeRoom}
                windowWidth={windowWidth}
                theme={theme}
                navigation={navigation}
                unReadMessagesCount={unreadMessagesCount}
            />
            )
          })}
        </ScrollView>
        {showLoadMore ? (
          <View
            style={{
              backgroundColor: theme.palette.background.main,
              ...styles.showMoreButtonContainer,
            }}
          >
            <Button
              title={"Load more"}
              variant={"text"}
              onPress={() => {
                setShowLoadMore(false)
                getNextPage();
              }}
            />
          </View>
        ) : null}
      </>
    )
  }
  return (
    <FlatList
      data={rooms.results}
      refreshing={loading}
      onRefresh={resetResults}
      renderItem={({item}) => {
        const unreadMessagesCount = countUnreadMessages(item.id, unreadMessages);
        return (
          <RoomDetail
            key={item.id}
            room={item}
            storeRoom={storeRoom}
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
  )
}

function Rooms({ route, navigation }) {
  const theme = useTheme()
  const {unreadMessages} = unreadMessagesStore();
  const resultsListViewRef = useRef();
  const isWeb = Boolean(Platform.OS === "web");
  const [searchFeedback, setSearchFeedback] = useState(null);
  const [advancedSearch, setAdvancedSearch] = useState(false);
  const [loadingNext, setLoadingNext] = useState(false);
  const windowWidth = Dimensions.get("window").width;
  const {object: rooms, error, loading, get, clear} = useRoomsStore();
  const { store: storeRoom } = useRoomStore();
  const { object: user } = useUserStore();

  async function getRoomsFromAPI(url=BACKEND_ENDPOINTS.room, doNotMergeResults=false) {
    if (url.includes("/api/")) {
      setSearchFeedback(null);
    }
    if (rooms) {
      await get(url, rooms.results, doNotMergeResults);
    } else {
      await get(url, [], doNotMergeResults);
    }
    if (doNotMergeResults) {
      if (resultsListViewRef.current) {
        // For fresh results scroll back to top.
        if (isWeb) {
          resultsListViewRef.current.scrollTo({ offset: 0, animated: false });
        } else {
          resultsListViewRef.current.scrollToOffset({ offset: 0, animated: true });
        }
      }
    }
    setAdvancedSearch(false);
  }

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      if (!isActive) {
        return
      }

      const initialQuery = route.params ? route.params.initialQuery : null;
      if (initialQuery) {
        getRoomsFromAPI(initialQuery);
        route.params = null;
      } else {
        getRoomsFromAPI();
      }
      return () => {
        setSearchFeedback(null);
        setAdvancedSearch(false);
        setLoadingNext(false);
        isActive = false;
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
    setSearchFeedback(null);
    clear();
    await get(BACKEND_ENDPOINTS.room, [], true);
  }

  if (!user) {
    return (
      <PleaseLoginMessage theme={theme} />
    )
  }

  const parsedError = error || {};
  return (
    <View style={styles.container}>
      {!loading ? (
        <SearchRooms
          advancedSearch={advancedSearch}
          setAdvancedSearch={setAdvancedSearch}
          getRoomsFromAPI={getRoomsFromAPI}
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
      {rooms && rooms.results.length ? (
        <SafeAreaView style={styles.listContainer}>
          <ListRooms
            isWeb={isWeb}
            navigation={navigation}
            resultsListViewRef={resultsListViewRef}
            rooms={rooms}
            storeRoom={storeRoom}
            unreadMessages={unreadMessages}
            resetResults={resetResults}
            getNextPage={getNextPage}
            loading={loading}
            windowWidth={windowWidth}
            theme={theme}
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
      <LoadingModal isLoading={loading && !loadingNext} debugMessage={"from @Rooms"}/>
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
  noRoomsFoundContainer: {
    height: "80%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  }
});

export default Rooms;
