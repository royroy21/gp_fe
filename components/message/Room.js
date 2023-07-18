import useUserStore from "../../store/user";
import {IconButton, Text, useTheme} from "@react-native-material/core";
import {FlatList, Keyboard, SafeAreaView, StyleSheet, View} from "react-native";
import MessageDetail from "./MessageDetail";
import TextInput from "../forms/TextInput";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import LoadingModal from "../loading/LoadingModal";
import React, {useCallback, useRef, useState} from "react";
import usePreviousMessagesStore from "../../store/previousMessages";
import {BACKEND_ENDPOINTS, DEFAULT_ERROR_MESSAGE} from "../../settings";
import useJWTStore from "../../store/jwt";
import Errors from "../forms/Errors";
import {useFocusEffect} from "@react-navigation/native";
import getWebSocket, {readyStates} from "./index";
import Loading from "../loading/Loading";
import RoomOptionsModal from "./RoomOptionsModal";

function Room(props) {
  const theme = useTheme();
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
    await get(BACKEND_ENDPOINTS.message + "?room_id=" + room.id, [], setMessages);
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
    callback();
    setAlert(null);
  }

  function executeMessageReceivedBehavior(event) {
    const newMessage = JSON.parse(event.data);
    setMessages(prevState => [newMessage, ...prevState]);
    if (newMessage.user.id === user.id) {
      messagesRef.current.scrollToIndex({index: 0, animated: true});
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

  const parsedError = error || {};
  return (
    <>
      <Loading isLoading={loadingPreviousPage} positionTop={true} />
      <RoomOptionsModal
        room={room}
        showOptions={showOptions}
        setOptions={setOptions}
        theme={theme}
      />
      <View style={styles.container}>
        {/*<Text>*/}
        {/*  {`room: ${room.id} connection status: ${webSocket ? readyStates[webSocket.readyState] : "null"}`}*/}
        {/*</Text>*/}
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
          </SafeAreaView>
        ) : (
          <View style={styles.noMessagesContainer}>
            <Text>{" "}</Text>
          </View>
        )}
        <View style={styles.inputContainer}>
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
        </View>
        <LoadingModal isLoading={loading || webSocket ? webSocket.readyState === 0 : true} />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
  messagesContainer: {
    height: "90%",
  },
  inputContainer: {
    padding: 5,
    position: "absolute",
    bottom: 0,
    width: "100%",
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
    top: 5,
    right: 15,
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
