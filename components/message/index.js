import {BACKEND_SOCKET_ENDPOINTS} from "../../settings";

export const readyStates = {
  0: "CONNECTING",
  1: "OPEN",
  2: "CLOSING",
  3: "CLOSED",
}

const webSockets = {
}

export function closeAndDeleteOtherWebSockets(room = null) {
  Object.keys(webSockets).forEach(key => {
    if (key === room) {
      return
    }
    const ws = webSockets[key];
    ws.close();
    delete webSockets[key];
  });
}

function getWebSocket({room, accessToken, closeOtherWebSockets = false}) {
  if (closeOtherWebSockets) {
    closeAndDeleteOtherWebSockets();
  }
  const existingWebSocket = webSockets[room];
  if (existingWebSocket) {
    return existingWebSocket;
  }
  const url = `${BACKEND_SOCKET_ENDPOINTS.message}${room}/?token=${accessToken}`;
  webSockets[room] = new WebSocket(url);
  return webSockets[room];
}

export default getWebSocket;
