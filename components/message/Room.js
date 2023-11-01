import useUserStore from "../../store/user";
import {Button, IconButton, Text, useTheme} from "@react-native-material/core";
import {FlatList, Keyboard, Platform, SafeAreaView, StyleSheet, View} from "react-native";
import MessageDetail from "./MessageDetail";
import TextInput from "../forms/TextInput";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import LoadingModal from "../loading/LoadingModal";
import React, {useCallback, useEffect, useRef, useState} from "react";
import usePreviousMessagesStore from "../../store/previousMessages";
import {BACKEND_ENDPOINTS, DEFAULT_ERROR_MESSAGE} from "../../settings";
import useJWTStore from "../../store/jwt";
import Errors from "../forms/Errors";
import {useFocusEffect} from "@react-navigation/native";
import getWebSocket, {readyStates} from "./index";
import Loading from "../loading/Loading";
import RoomOptionsModal from "./RoomOptionsModal";
import unreadMessagesStore from "../../store/unreadMessages";
import {ScrollView} from "react-native-web";

const DEBUG = true;

function ListMessages(props) {
  const messagesContentRef = useRef(null);
  const [showLoadMore, setShowLoadMore] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [messagesContentMarginTop, setMessagesContentMarginTop] = useState(0);
  const {
    isWeb,
    showLoadMoreButton,
    user,
    getPreviousPage,
    messagesRef,
    messages,
    previousMessages,
    loadingPreviousPage,
    theme,
  } = props;

  const isCloseToTop = ({contentOffset}) => {
    return contentOffset.y === 0
  };
  const onScroll = ({nativeEvent}) => {
    if (isCloseToTop(nativeEvent) && !loadingPreviousPage && previousMessages.next) {
      setShowLoadMore(true);
    } else if (showLoadMore){
      setShowLoadMore(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      if (isWeb && initialLoad) {
        setInitialLoad(false);
        messagesRef.current.scrollToEnd();
      }
      return () => {
        setShowLoadMore(false);
        setInitialLoad(true);
        setMessagesContentMarginTop(0);
      };
    }, [])
  );

  useEffect(() => {
    if (!isWeb) {
      return
    }
    // Really hacky way to get margin to set correctly so web messages start at bottom of screen.
    if (messagesRef.current && messagesContentRef.current) {
      const marginTop = messagesRef.current.clientHeight - messagesContentRef.current.clientHeight;
      if (marginTop > 0) {
        setMessagesContentMarginTop(marginTop);
      } else if (messagesContentMarginTop !== 0) {
        setMessagesContentMarginTop(0);
      }
    }
  }, [messages])

  if (isWeb) {
    const reversedMessages = messages.slice().reverse();
    return (
      <>
        {showLoadMore && showLoadMoreButton ? (
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
                getPreviousPage();
              }}
            />
          </View>
        ) : null}
        <ScrollView
          ref={messagesRef}
          onScroll={onScroll}
          scrollEventThrottle={400}
          style={{height: "100%"}}
        >
          <View
            ref={messagesContentRef}
            style={{marginTop: messagesContentMarginTop}}
          >
          {reversedMessages.map(item => (
            <MessageDetail
              key={item.id}
              message={item}
              isLocalUser={item.user.id === user.id}
              theme={theme}
            />
          ))}
          </View>
        </ScrollView>
      </>
    )
  }

  return (
    <FlatList
      inverted={true}
      onEndReached={getPreviousPage}
      ref={messagesRef}
      data={messages}
      keyExtractor={(item) => String(item.id)}
      renderItem={({item}) => (
        <MessageDetail
          message={item}
          isLocalUser={item.user.id === user.id}
          theme={theme}
        />
      )}
    />
  )
}

function Room(props) {
  // If isWeb we get last PAGE_SIZE messages, but the user cannot get anymore.
  // This is a way to solve the `snap to top` on content change problem.
  // EG we just don't ever change the content size. Boom.
  // If user needs to see older messages they use mobile.
  // TODO - could come back to this problem later.
  const PAGE_SIZE = 150;
  const showLoadMoreButton = false;

  const {remove: removeRoomFromUnReadMessages} = unreadMessagesStore();
  const theme = useTheme();
  const isWeb = Boolean(Platform.OS === "web");
  const { navigation, route } = props;
  const room = route.params.room;
  const { object: user } = useUserStore();

  const messagesRef = useRef(null);
  const [webSocket, setWebSocket] = useState(null);
  const [loadingPreviousPage, setLoadingPreviousPage] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);
  const [showOptions, setOptions] = useState(false);

  const {object: jwt} = useJWTStore();
  if (!jwt) {
    navigation.navigate("DefaultScreen");
  }
  const accessToken = JSON.parse(jwt).access;

  const {object: previousMessages, loading, get, clear} = usePreviousMessagesStore();
  const getPreviousMessages = async () => {
    clear();
    let params = `?room_id=${room.id}`
    if (isWeb && PAGE_SIZE) {
      params += `&page_size=${PAGE_SIZE}`
    }
    await get(BACKEND_ENDPOINTS.message + params, [], setMessages);
  }

  const setUpWebSocket = (callback) => {
    setAlert("connecting");
    if (webSocket) {
      webSocket.close();
      setWebSocket(null)
    }
    const webSocketParams = {
      room: room.id,
      accessToken: accessToken,
      closeOtherWebSockets: true,
    }
    const ws = getWebSocket(webSocketParams);
    ws.onopen = () => {
    }
    ws.onerror = () => {
      setError({detail: DEFAULT_ERROR_MESSAGE});
      ws.close();
    }
    ws.onmessage = (e) => {
      executeMessageReceivedBehavior(e);
    }
    setWebSocket(ws);
    removeRoomFromUnReadMessages(room.id);
    callback();
    setAlert(null);
  }

  if (DEBUG) {
    // because sockets are flaky..
    console.log("\n\n==> starting room.", room.id);
    console.log("==> ready state of socket client: ", webSocket ? readyStates[webSocket.readyState] : "no socket found");
    console.log("==> messages length: ", messages.results ? messages.results.length : "no messages");
    console.log("==> loading from usePreviousMessagesStore (on first page load): ", loading);
    console.log("==> loadingPreviousPage (when scrolling up): ", loadingPreviousPage);
    console.log("\n\n");
  }

  function executeMessageReceivedBehavior(event) {
    const newMessage = JSON.parse(event.data);
    setMessages(prevState => [newMessage, ...prevState]);
    if (newMessage.user.id === user.id) {
      if (!messagesRef.current) {
        return
      }
      if (isWeb) {
        // A horrible hack so that the scrollView has chance
        // to update it's size before performing the scrollToEnd.
        setTimeout(messagesRef.current.scrollToEnd, 1000);
      } else {
        messagesRef.current.scrollToIndex({index: 0, animated: true});
      }
    } else {
      setAlert("new message received");
      setTimeout(() => setAlert(null), 1500);
    }
  }

  useFocusEffect(
    useCallback(() => {
      setUpWebSocket(getPreviousMessages);
      return () => {
        setMessage("");
        setMessages([]);
        setError(null);
        setWebSocket(null);
        setAlert(null);
        setOptions(false);
      };
    }, [room])
  );

  const send = () => {
    webSocket.send(JSON.stringify({message: message}));
    setMessage("");
    Keyboard.dismiss();
  }

  async function getPreviousPage() {
    if (previousMessages.next) {
      setLoadingPreviousPage(true);
      await get(previousMessages.next, messages, setMessages);
      setLoadingPreviousPage(false);
    }
  }

  const waitingForSocket = () => {
    if (!WebSocket) {
      return true
    }
    // readyState 0 means websocket is connecting
    return webSocket.readyState === 0;
  }

  const parsedError = error || {};
  return (
    <>
      <Loading isLoading={loadingPreviousPage} positionTop={true} />
      <RoomOptionsModal
        room={room}
        user={user}
        showOptions={showOptions}
        setOptions={setOptions}
        theme={theme}
      />
      <View style={styles.container}>
        <IconButton
          style={{
            ...styles.menuButton,
            backgroundColor: theme.palette.background.main,
          }}
          onPress={() => setOptions(!showOptions)}
          icon={
            <Icon
              name={"message-cog"}
              size={30}
              color={theme.palette.secondary.main}
            />
          }
        />
        {alert !== null ? (
          <View
            style={{
              ...styles.alert,
              backgroundColor: theme.palette.background.main,
            }}
          >
            <Text style={{color: theme.palette.primary.main}}>
              {alert}
            </Text>
          </View>
        ) : null}
        {(parsedError.detail) && <Errors errorMessages={parsedError.detail} />}
        {messages.length ? (
          <SafeAreaView style={styles.messagesContainer}>
            <ListMessages
              isWeb={isWeb}
              showLoadMoreButton={showLoadMoreButton}
              user={user}
              getPreviousPage={getPreviousPage}
              messagesRef={messagesRef}
              messages={messages}
              previousMessages={previousMessages}
              loadingPreviousPage={loadingPreviousPage}
              theme={theme}
            />
          </SafeAreaView>
        ) : (
          <View style={styles.noMessagesContainer}>
            <Text>{" "}</Text>
          </View>
        )}
        {isWeb ? (
          <TextInput
            onChangeText={(text) => setMessage(text)}
            value={message}
            multiline={true}
            trailing={
              <IconButton
                onPress={send}
                icon={
                  <Icon
                    name={"send"}
                    size={25}
                    color={theme.palette.secondary.main}
                  />
                }
              />
            }
          />
        ) : (
          <TextInput
            inputStyle={{
              paddingTop: 10,
              paddingBottom: 10,
            }}
            multiline={true}
            onChangeText={(text) => setMessage(text)}
            value={message}
            trailing={
              <IconButton
                onPress={send}
                icon={
                  <Icon
                    name={"send"}
                    size={25}
                    color={theme.palette.secondary.main}
                  />
                }
              />
            }
          />
        )}
        {
          webSocket ? (
            <LoadingModal isLoading={(loading || waitingForSocket()) && !loadingPreviousPage} />
          ) : null
        }
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    height: "100%",
  },
  messagesContainer: {
    height: "88%",
  },
  noMessagesContainer: {
    height: "85%",
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  menuButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 2,
  },
  showMoreButtonContainer: {
    position: "absolute",
    width: "100%",
    top: 0,
    marginLeft: "auto",
    marginRight: "auto",
    zIndex: 2,
  },
  alert: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Room;
