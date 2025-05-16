import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import socket from "./socket";

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const user = useSelector((state) => state.auth.user);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const data = {
        message,
        username: user?.username || "Гость",
        avatar: user?.profilePic || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnFRPx77U9mERU_T1zyHcz9BOxbDQrL4Dvtg&s", // Используем аватар из профиля
      };
      socket.emit("send_message", data);
      setMessage("");
    }
  };

  useEffect(() => {
    socket.on("message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  return (
    <div className="flex flex-col items-center p-4">
      <div className="w-full max-w-md p-2 border rounded-lg mb-4">
        {messages.map((msg, index) => (
          <div key={index} className="flex items-center gap-2 p-2 border-b last:border-none">
            <img
              src={msg.avatar}
              alt="avatar"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <strong>{msg.username}:</strong> {msg.message}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          className="input input-primary flex-grow"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          placeholder="Напиши сообщение..."
        />
        <button className="btn btn-primary" type="submit">
          Отправить
        </button>
      </form>
    </div>
  );
}

export default App;
