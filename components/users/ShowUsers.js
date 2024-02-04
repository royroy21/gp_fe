import {Dimensions, FlatList, Platform, SafeAreaView, StyleSheet, View} from "react-native";
import React, {useEffect, useRef, useState} from "react";
import ShowUser from "./ShowUser";
import {APOLOGY_PREFIX, BACKEND_ENDPOINTS} from "../../settings";
import {Button, IconButton, Text, useTheme} from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import Errors from "../forms/Errors";
import Loading from "../loading/Loading";
import LoadingModal from "../loading/LoadingModal";
import {useFocusEffect} from "@react-navigation/native";
import useUsersStore from "../../store/users";
import SearchUsers from "./SearchUsers";
import {ScrollView} from "react-native-web";
import useOtherUserStore from "../../store/otherUser";
import useUserStore from "../../store/user";

function ListUsers(props) {
  const [showLoadMore, setShowLoadMore] = useState(false);
  const {
    isWeb,
    navigation,
    resultsListViewRef,
    users,
    storeOtherUser,
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
    if (isCloseToBottom(nativeEvent) && !loading && users.next) {
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
          {users.results.map(item => (
            <ShowUser
              key={item.id}
              user={item}
              storeOtherUser={storeOtherUser}
              windowWidth={windowWidth}
              theme={theme}
              navigation={navigation}
            />
          ))}
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
      ref={resultsListViewRef}
      // https://reactnative.dev/docs/optimizing-flatlist-configuration
      // removeClippedSubviews={true}
      data={users.results}
      refreshing={false}
      onRefresh={resetResults}
      renderItem={({item}) => (
        <ShowUser
          key={item.id}
          user={item}
          storeOtherUser={storeOtherUser}
          windowWidth={windowWidth}
          theme={theme}
          navigation={navigation}
        />
      )}
      keyExtractor={item => item.id}
      onEndReached={() => getNextPage()}
    />
  )
}

function ShowUsers({ navigation }) {
  const theme = useTheme()
  const resultsListViewRef = useRef();
  const isWeb = Boolean(Platform.OS === "web");
  const windowWidth = Dimensions.get("window").width;

  const [advancedSearch, setAdvancedSearch] = useState(false);
  const [loadingNext, setLoadingNext] = useState(false);

  const users = useUsersStore((state) => state.object);
  const searchFeedback = useUsersStore((state) => state.searchFeedback);
  const setSearchFeedback = useUsersStore((state) => state.setSearchFeedback);
  const setLastURL = useUsersStore((state) => state.setLastURL);
  const error = useUsersStore((state) => state.error);
  const loading = useUsersStore((state) => state.loading);
  const get = useUsersStore((state) => state.get);
  const clear = useUsersStore((state) => state.clear);

  const user = useUserStore((state) => state.object);

  const storeOtherUser = useOtherUserStore((state) => state.store);

  async function getUsersFromAPI(url=BACKEND_ENDPOINTS.user, doNotMergeResults=false) {
    setLastURL(url);

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
    React.useCallback(() => {
      let isActive = true;
      if (!isActive) {
        return
      }

      if (!users) {
        getUsersFromAPI();
        return;
      }

      if (error) {
        setSearchFeedback(null);
      }

      return () => {
        setAdvancedSearch(false);
        setLoadingNext(false);
        isActive = false;
      };
    }, [users, error])
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
          user={user}
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
          <ListUsers
            isWeb={isWeb}
            navigation={navigation}
            resultsListViewRef={resultsListViewRef}
            users={users}
            storeOtherUser={storeOtherUser}
            resetResults={resetResults}
            getNextPage={getNextPage}
            loading={loading}
            windowWidth={windowWidth}
            theme={theme}
          />
        </SafeAreaView>
      ) : (
        !loading ? (
          <View style={styles.noUsersFoundContainer}>
            <Text>{"None found "}</Text>
            <Icon name="pig" size={25} color={theme.palette.secondary.main}/>
          </View>
        ) : null
      )}
      <LoadingModal isLoading={loading && !loadingNext} debugMessage={"from @ShowUsers"}/>
      <Loading isLoading={loading && loadingNext} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  showMoreButtonContainer: {
    position: "absolute",
    width: "100%",
    bottom: 0,
    marginLeft: "auto",
    marginRight: "auto",
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
