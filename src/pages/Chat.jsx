import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import socket from "../socket";
import moment from "moment"; // ✅ ВАЖНО: импорт moment
import { IoSendSharp } from "react-icons/io5";

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
    if (currentUser) {
      socket.emit("user_joined", currentUser);
    }
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
    <div className="flex flex-col h-screen bg-base-100 flex-1">
      <div className="bg-base-300 h-[10%] p-4 shadow mb-2">
        <h2 className="text-lg font-bold">{selectedUser?.username || "Пользователь не выбран"}</h2>
        <p className={selectedUser?.status ? "text-success" : "text-error"}>
          {typingUser ? (
            <span className="flex items-center gap-1">
              Печатает
              <span className="animate-bounce">.</span>
              <span className="animate-bounce delay-150">.</span>
              <span className="animate-bounce delay-300">.</span>
            </span>
          ) : selectedUser?.status ? (
            "Online"
          ) : (
            "Offline"
          )}
        </p>
      </div>

      <div className="flex-1 bg-base-100 rounded-md shadow p-4 overflow-y-auto">
        {chatMessages.map((msg, index) => (

          <div
            key={index}
            className={`mb-2 ${msg.from === currentUser._id
              ? "flex items-center gap-4 justify-start flex-row-reverse"
              : "flex items-center gap-4 justify-start"
              }`}
          >
            <figure>
              <img
                className="size-14 rounded-full"
                src={
                  msg.from === currentUser._id
                    ? currentUser.image || "https://static.vecteezy.com/system/resources/thumbnails/028/149/256/small_2x/3d-user-profile-icon-png.png"
                    : selectedUser?.image || "https://static.vecteezy.com/system/resources/thumbnails/028/149/256/small_2x/3d-user-profile-icon-png.png"
                }
                alt=""
              />
            </figure>
            <div>
              {msg.from === currentUser._id ? (
                <p className="text-end px-1 text-primary font-bold">Me</p>
              ) : (
                <p className="font-bold">{selectedUser?.username}</p>
              )}
              <span
                className={`inline-block px-3 py-1 rounded-2xl max-w-[570px] break-words min-w-[220px] ${msg.from === currentUser._id
                  ? "bg-[#833AB4] bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCB045] text-white"
                  : "bg-[#020024] bg-gradient-to-r from-[rgba(2,0,36,1)] via-[rgba(9,9,121,1)] to-[rgba(0,212,255,1)] text-white"
                  }`}
              >
                {msg.text}
              </span>
              <div className={`text-xs ${msg.from === currentUser._id ? "flex items-center gap-4 justify-end" : "flex items-center gap-4 justify-start"}`}>
                <span className="text-balance text-base-content/35">{moment(msg.timestamp).calendar()}</span>
              </div>
            </div>
          </div>

        ))}
        
      </div>

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
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSendMessage();
          }}
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          <IoSendSharp />
        </button>
      </div>
    </div>
  );
};

export default Chat;
