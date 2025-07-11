import { io } from "socket.io-client";

const socket = io("https://websocket-server-01.onrender.com");
// const socket = io("http://localhost:5000/");
// const socket = io("http://172.20.10.12:5000", {
//   transports: ["websocket"], // ❗ optional
//   withCredentials: true,
// });
export default socket;
