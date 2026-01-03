import SockJS from "sockjs-client";
import Stomp from "stompjs";
import store from "../store/store";
import { applyMove, rollbackMove } from "../store/puzzleSlice";

let stompClient = null;
let sessionId = null;

export function connectWS(roomId) {
  if (stompClient && stompClient.connected) {
    stompClient.disconnect();
  }

  const socket = new SockJS(import.meta.env.VITE_API_URL + "/ws");
  stompClient = Stomp.over(socket);

  stompClient.connect({}, frame => {
    sessionId = frame.headers["session"];
    console.log("WS Connected:", sessionId);

    stompClient.subscribe(`/topic/room/${roomId}`, msg => {
      const body = JSON.parse(msg.body);
      if (body.type === 'reset' || body.reset) {
        store.dispatch(applyMove([
          [0,0,0,0],
          [0,0,0,0],
          [0,0,0,0],
          [0,0,0,0]
        ]));
      } else {
        store.dispatch(applyMove(body.grid));
      }
    });

    stompClient.subscribe(`/queue/errors-${sessionId}`, error => {
      const {row, col} = JSON.parse(error.body);
      store.dispatch(rollbackMove({row, col}));
    });

    if (stompClient.connected) {
      stompClient.send("/app/getState", {}, JSON.stringify({ roomId, sessionId }));
    }
  });
}

export function sendMove(roomId, row, col, value) {
  if (stompClient && stompClient.connected) {
    stompClient.send("/app/move", {}, JSON.stringify({ roomId, row, col, value, sessionId }));
  }
}

export function sendReset(roomId) {
  if (stompClient && stompClient.connected) {
    stompClient.send("/app/reset", {}, JSON.stringify({ roomId, sessionId }));
  }
}

export function getStompClient() {
  return stompClient;
}
