import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import socket from "../socket";
import moment from "moment";
import "moment/locale/ru";
moment.locale("ru");

const Chat = () => {
  const currentUser = useSelector((state) => state.auth.user);
  const selectedUser = useSelector((state) => state.selectChat.selectedUser);

  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [typingUser, setTypingUser] = useState(null);

  useEffect(() => {
    if (!selectedUser || !currentUser) return;
    setChatMessages([]);
    socket.emit("get_history", {
      from: currentUser._id,
      to: selectedUser._id,
    });
  }, [selectedUser]);

  useEffect(() => {
    if (currentUser) socket.emit("user_joined", currentUser);
  }, [currentUser]);

  useEffect(() => {
    const receiveMessage = (data) => {
      if (
        (data.from === currentUser._id && data.to === selectedUser?._id) ||
        (data.from === selectedUser?._id && data.to === currentUser._id)
      ) {
        setChatMessages((prev) => [...prev, data]);
      }
    };

    const receiveTyping = (data) => {
      if (data.from === selectedUser?._id) {
        setTypingUser(true);
        setTimeout(() => setTypingUser(null), 1500);
      }
    };

    const receiveHistory = (messages) => {
      setChatMessages(messages);
    };

    socket.on("receive_message", receiveMessage);
    socket.on("typed", receiveTyping);
    socket.on("chat_history", receiveHistory);

    return () => {
      socket.off("receive_message", receiveMessage);
      socket.off("typed", receiveTyping);
      socket.off("chat_history", receiveHistory);
    };
  }, [selectedUser, currentUser]);

  const handleSendMessage = () => {
    if (!message.trim() || !selectedUser) return;

    const msgData = {
      from: currentUser._id,
      to: selectedUser._id,
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
      from: currentUser._id,
      to: selectedUser._id,
    });
  };

  return (
    <div className="flex flex-col w-full h-screen bg-base-100">
      {/* Header */}
      <div className="bg-base-300 p-4 shadow mb-2">
        <h2 className="text-lg font-bold">{selectedUser?.username}</h2>
        <p className={selectedUser?.status ? "text-success" : "text-error"}>
          {typingUser ? (
            <span className="flex items-center gap-1">
              Печатает<span className="animate-bounce">.</span>
              <span className="animate-bounce delay-150">.</span>
              <span className="animate-bounce delay-300">.</span>
            </span>
          ) : selectedUser?.status ? "Online" : "Offline"}
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 w-full overflow-y-auto p-4 space-y-3">
        {chatMessages.map((msg, i) => {
          const isMe = msg.from === currentUser._id;
          const avatar = isMe
            ? currentUser.profilePic
            : selectedUser?.profilePic;

          return (
            <div
              key={i}
              className={`flex gap-3 items-end ${isMe ? "justify-end" : "justify-start"}`}
            >
              {!isMe && (
                <img
                  src={avatar || "https://via.placeholder.com/40"}
                  className="w-10 h-10 rounded-full"
                  alt="avatar"
                />
              )}
              <div>
                <div
                  className={`rounded-2xl p-3 text-white text-sm ${isMe
                      ? "bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400"
                      : "bg-gradient-to-r from-blue-900 via-indigo-700 to-cyan-500"
                    }`}
                >
                  {msg.text}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {moment(msg.timestamp).calendar()}
                </div>
              </div>
              {isMe && (
                <img
                  src={avatar || "https://via.placeholder.com/40"}
                  className="w-10 h-10 rounded-full"
                  alt="avatar"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="p-4 bg-base-300 flex gap-2">
        <input
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            handleTyping();
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Xabar yozing..."
          className="flex-1 input input-bordered"
        />
        <button onClick={handleSendMessage} className="btn btn-primary">
          Yuborish
        </button>
      </div>
    </div>
  );
};

export default Chat;
