import { io } from "socket.io-client";

const socket = io("https://websocket-server-01.onrender.com");

export default socket;
