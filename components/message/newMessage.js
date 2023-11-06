import {BACKEND_SOCKET_ENDPOINTS, DEFAULT_ERROR_MESSAGE} from "../../settings";

const newMessage = ({ storeRoom, navigation, parameters, accessToken, setLoading, setError }) => {
  setLoading(true);
  const url = BACKEND_SOCKET_ENDPOINTS.newMessage + parameters;
  const ws = new WebSocket(url + "&token=" + accessToken);
  ws.onerror = () => {
    setError({detail: DEFAULT_ERROR_MESSAGE});
    ws.close();
    setLoading(false);
  };
  ws.onmessage = (e) => {
    const room = JSON.parse(e.data)["room"];
    ws.close();
    setLoading(false);
    storeRoom(room);
    navigation.push("Room", {id: room.id});
  };
}

export default newMessage;
