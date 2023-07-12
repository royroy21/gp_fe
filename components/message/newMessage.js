import {BACKEND_SOCKET_ENDPOINTS, DEFAULT_ERROR_MESSAGE} from "../../settings";

const newMessage = ({navigation, parameters, accessToken, setLoading, setError}) => {
  const url = BACKEND_SOCKET_ENDPOINTS.newMessage + parameters;
  const ws = new WebSocket(url + "&token=" + accessToken);
  ws.onerror = () => {
    setError({detail: DEFAULT_ERROR_MESSAGE});
    ws.close();
    setLoading(false);
  };
  ws.onmessage = (e) => {
    const room = JSON.parse(e.data)["room"];
    setLoading(false);
    ws.close();
    navigation.navigate("Room", {room: room});
  };
}

export default newMessage;
