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
  const {object: jwt} = useJWTStore();
  if (!jwt) {
    navigation.navigate("DefaultScreen");
  }
  const accessToken = JSON.parse(jwt).access;

  const {object: previousMessages, loading, get, clear} = usePreviousMessagesStore();
  const getPreviousMessages = async () => {
    clear();
    await get(BACKEND_ENDPOINTS.message + "?room_id=" + room, [], setMessages);
  }

  const setUpWebSocket = () => {
    if (webSocket) {
      webSocket.close();
      setWebSocket(null)
    }
    const webSocketParams = {
      room: room,
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
      const newMessage = JSON.parse(e.data);
      setMessages(prevState => [...prevState, newMessage])
    }
    setWebSocket(ws);
  }

  useFocusEffect(
    useCallback(() => {
      getPreviousMessages();
      setUpWebSocket();
      return () => {
        setMessage("");
        setMessages([]);
        setError(null);
        setWebSocket(null);
      };
    }, [room])
  );

  const send = () => {
    webSocket.send(JSON.stringify({message: message}));
    setMessage("");
    Keyboard.dismiss();
  }

  const handleMessagesContentChange = () => {
    if (messagesRef.current) {
      messagesRef.current.scrollToEnd({ animated: true });
    }
  };

  async function getPreviousPage() {
    if (previousMessages.next) {
      setLoadingPreviousPage(true);
      await get(previousMessages.next, messages, setMessages);
      setLoadingPreviousPage(false);
    }
  }

  async function handleScroll (event) {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY === 0) {
      await getPreviousPage();
    }
  }

  const parsedError = error || {};
  return (
    <>
      <Loading isLoading={loadingPreviousPage} positionTop={true} />
      <View style={styles.container}>
        <Text>
          {`room: ${room} connection status: ${webSocket ? readyStates[webSocket.readyState] : "null"}`}
        </Text>
        {(parsedError.detail) && <Errors errorMessages={parsedError.detail} />}
        {messages.length ? (
          <SafeAreaView style={styles.messagesContainer}>
            <FlatList
              ref={messagesRef}
              // onScroll={handleScroll}
              data={messages}
              onContentSizeChange={handleMessagesContentChange}
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
            inputContainerStyle={{
              // borderWidth: 1,
              // borderColor: "pink",
            }}
            inputStyle={{
              // borderWidth: 1,
              // borderColor: "pink",
              // paddingBottom: 10,
            }}
            trailingContainerStyle={{
              // paddingBottom: 5,
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
    height: "85%",
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
});

export default Room;
