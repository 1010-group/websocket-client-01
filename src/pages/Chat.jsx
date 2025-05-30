import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import socket from "../socket";

const Chat = () => {
  const currentUser = useSelector((state) => state.auth.user);
  const selectedUser = useSelector((state) => state.selectChat.selectedUser);

  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [typingUser, setTypingUser] = useState(null);

  // ✅ Fetch old messages from backend
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/messages/${currentUser._id}/${selectedUser._id}`
        );
        const data = await res.json();
        setChatMessages(data);
      } catch (err) {
        console.error("Xatolik message history:", err);
      }
    };

    if (currentUser && selectedUser) {
      fetchMessages();
    }
  }, [currentUser, selectedUser]);

  // ✅ Setup socket listeners
  useEffect(() => {
    const handleReceiveMessage = (data) => {
      setChatMessages((prev) => [...prev, data]);
    };

    const handleTyping = (data) => {
      setTypingUser(data.from.username);
      setTimeout(() => setTypingUser(null), 2000);
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("typed", handleTyping);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("typed", handleTyping);
    };
  }, []);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const msgData = {
      from: currentUser,
      to: selectedUser,
      text: message,
      timestamp: new Date(),
    };

    socket.emit("send_message", msgData);
    setChatMessages((prev) => [...prev, msgData]);
    setMessage("");
  };

  const handleTyping = () => {
    if (!selectedUser) return;
    socket.emit("typing", {
      from: currentUser,
      to: selectedUser,
    });
  };

  return (
    <div className="flex flex-col h-screen bg-base-100 flex-1">
      {/* Header */}
      <div className="bg-base-300 h-[10%] p-4 shadow mb-2">
        <h2 className="text-lg font-bold">{selectedUser?.username}</h2>
        <p
          className={`${
            selectedUser?.status ? "text-success" : "text-error"
          }`}
        >
          {typingUser === selectedUser?.username &&
          selectedUser?._id !== currentUser._id
            ? "Typing..."
            : selectedUser?.status
            ? "Online"
            : "Offline"}
        </p>
      </div>

      {/* Chat Body */}
      <div className="flex-1 bg-base-100 rounded-md shadow p-4 overflow-y-auto">
        {chatMessages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 ${
              msg.from === currentUser._id || msg.from?._id === currentUser._id
                ? "text-right text-blue-600"
                : "text-left text-green-600"
            }`}
          >
            <p className="text-sm">{msg.text}</p>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="mt-2 flex gap-2 bg-base-300 p-3 rounded-md h-1/12">
        <input
          type="text"
          placeholder="Xabar yozing..."
          className="flex-1 p-2 border rounded"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            handleTyping();
          }}
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Yuborish
        </button>
      </div>
    </div>
  );
};

export default Chat;
