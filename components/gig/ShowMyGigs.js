import {Dimensions, FlatList, Platform, SafeAreaView, StyleSheet, View} from "react-native";
import React, {useEffect, useRef, useState} from "react";
import ShowGig from "./ShowGig";
import {BACKEND_ENDPOINTS, smallScreenWidth} from "../../settings";
import AddGigButton from "./AddGigButton";
import {Button, IconButton, Text, useTheme} from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import Errors from "../forms/Errors";
import Loading from "../loading/Loading";
import LoadingModal from "../loading/LoadingModal";
import {useFocusEffect} from "@react-navigation/native";
import {ScrollView} from "react-native-web";
import useUserStore from "../../store/user";
import useMyGigsStore from "../../store/myGigs";
import SearchMyGigs from "./SearchMyGigs";
import PleaseLoginMessage from "../loginSignUp/PleaseLoginMessage";
import useGigStore from "../../store/gig";

function ListGigs(props) {
  const [showLoadMore, setShowLoadMore] = useState(false);
  const {
    isWeb,
    navigation,
    resultsListViewRef,
    user,
    gigs,
    storeGig,
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
    if (isCloseToBottom(nativeEvent) && !loading && gigs.next) {
      setShowLoadMore(true)
    }  else if (showLoadMore){
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
          {gigs.results.map(item => (
            <ShowGig
              key={item.id}
              user={user}
              gig={item}
              storeGig={storeGig}
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
      data={gigs.results}
      refreshing={false}
      onRefresh={resetResults}
      renderItem={({item}) => (
        <ShowGig
          user={user}
          gig={item}
          storeGig={storeGig}
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

function ShowMyGigs({ navigation }) {
  const isWeb = Boolean(Platform.OS === "web");
  const windowWidth = Dimensions.get('window').width;
  const isSmallScreen = windowWidth < smallScreenWidth;
  const isLargeScreen = isWeb && !isSmallScreen;

  const theme = useTheme()

  const resultsListViewRef = useRef();

  const [advancedSearch, setAdvancedSearch] = useState(false);
  const [loadingNext, setLoadingNext] = useState(false);

  const gigs = useMyGigsStore((state) => state.object);
  const searchFeedback = useMyGigsStore((state) => state.searchFeedback);
  const setSearchFeedback = useMyGigsStore((state) => state.setSearchFeedback);
  const setLastURL = useMyGigsStore((state) => state.setLastURL);
  const error = useMyGigsStore((state) => state.error);
  const loading = useMyGigsStore((state) => state.loading);
  const get = useMyGigsStore((state) => state.get);
  const clear = useMyGigsStore((state) => state.clear);

  const storeGig = useGigStore((state) => state.store);

  const user = useUserStore((state) => state.object);

  async function getGigsFromAPI(url=BACKEND_ENDPOINTS.gigs, doNotMergeResults=false) {
    if (url.includes("/api/")) {
      setSearchFeedback(null);
    }
    if (url.includes("/?")) {
      url += "&my_gigs=true"
    } else {
      url += "?my_gigs=true"
    }
    setLastURL(url);

    if (gigs) {
      await get(url, gigs.results, doNotMergeResults);
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

      if (!gigs && !error) {
        getGigsFromAPI();
      }

      if (error) {
        setSearchFeedback(null);
      }

      return () => {
        setAdvancedSearch(false);
        setLoadingNext(false);
        isActive = false;
      };
    }, [gigs, error])
  );

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
    await get(BACKEND_ENDPOINTS.gigs + "?my_gigs=true", [], true);
  }

  if (!user) {
    return (
      <PleaseLoginMessage theme={theme} />
    )
  }

  const parsedError = error || {};
  return (
    <View style={styles.outerContainer}>
      {isLargeScreen ? (
        <View style={{ flexDirection: "row" }}>
          {user ? (
            <Button
              title={"add gig"}
              compact={true}
              variant={"text"}
              onPress={() => navigation.push("AddGig")}
              style={{ width: 100}}
              titleStyle={{ fontSize: 10 }}
              leading={
                <Icon
                  name={"plus"}
                  size={20}
                  color={theme.palette.secondary.main}
                />
              }
            />
          ) : null}
          <Button
            title={"search"}
            compact={true}
            variant={"text"}
            onPress={() => setAdvancedSearch(!advancedSearch)}
            style={{ width: 100, marginLeft: "auto" }}
            titleStyle={{ fontSize: 10 }}
            leading={
              <Icon
                name={"magnify"}
                size={15}
                color={theme.palette.secondary.main}
              />
            }
          />
        </View>
      ) : (
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
      )}
      {!loading ? (
        <SearchMyGigs
          advancedSearch={advancedSearch}
          setAdvancedSearch={setAdvancedSearch}
          getGigsFromAPI={getGigsFromAPI}
          searchFeedback={searchFeedback}
          setSearchFeedback={setSearchFeedback}
          resetResults={resetResults}
          theme={theme}
        />
      ) : null}
      {(parsedError.detail) && <Errors errorMessages={parsedError.detail} />}
      {(parsedError.unExpectedError) && <Errors errorMessages={parsedError.unExpectedError} />}
      {gigs && gigs.results.length ? (
        <SafeAreaView style={styles.container}>
          <ListGigs
            isWeb={isWeb}
            navigation={navigation}
            resultsListViewRef={resultsListViewRef}
            user={user}
            gigs={gigs}
            storeGig={storeGig}
            resetResults={resetResults}
            getNextPage={getNextPage}
            loading={loading}
            windowWidth={windowWidth}
            theme={theme}
          />
        </SafeAreaView>
      ) : (
        !loading ? (
          <View style={styles.noGigsFoundContainer}>
            <Text>{"Add some gigs "}</Text>
            <Icon name="pig" size={25} color={theme.palette.secondary.main}/>
          </View>
        ) : null
      )}
      <LoadingModal isLoading={loading && !loadingNext} debugMessage={"from @ShowMyGigs"}/>
      <Loading isLoading={loading && loadingNext} />
      {!loading && !isLargeScreen ? <AddGigButton navigation={navigation} theme={theme} /> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  container: {
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
  noGigsFoundContainer: {
    height: "80%",
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ShowMyGigs;
