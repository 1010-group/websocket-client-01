import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import socket from "../socket";
import moment from "moment";
import { IoSendSharp } from "react-icons/io5";
import { FaChevronLeft } from "react-icons/fa";
import { setSelectedUser } from "../redux/slices/selectedUser";
import { toast } from "react-toastify";

const Chat = () => {
  const currentUser = useSelector((state) => state.auth.user);
  const selectedUser = useSelector((state) => state.selectChat.selectedUser);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [typingUser, setTypingUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { chatId } = useParams();

  useEffect(() => {
    if (!chatId || !currentUser) {
      navigate(chatId ? "/" : "/login");
      return;
    }

    setIsLoading(true);
    socket.emit("get_user", { userId: chatId });

    socket.once("user_data", (userData) => {
      setIsLoading(false);
      if (userData) {
        dispatch(setSelectedUser(userData));
      } else {
        toast.error("Пользователь не найден");
        navigate("/");
      }
    });

    return () => socket.off("user_data");
  }, [chatId, currentUser, dispatch, navigate]);

  useEffect(() => {
    if (!selectedUser || !currentUser) return;
    setIsLoading(true);

    socket.emit("get_history", {
      from: currentUser._id,
      to: selectedUser._id,
    });

    socket.once("chat_history", (messages) => {
      setChatMessages(messages);
      setIsLoading(false);
    });

    return () => socket.off("chat_history");
  }, [selectedUser, currentUser]);

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

    socket.on("receive_message", receiveMessage);
    socket.on("typed", receiveTyping);

    return () => {
      socket.off("receive_message", receiveMessage);
      socket.off("typed", receiveTyping);
    };
  }, [selectedUser, currentUser]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

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
    <div className="flex flex-col h-screen  bg-gradient-to-b from-[#0F172A] via-[#0D1B30]  border-r border-slate-800 to-base-100 flex-1">
      {/* Top bar */}
      <div className="bg-base-200 h-[10%] p-4 shadow-md  bg-gradient-to-b from-[#0F172A] via-[#0D1B30] to-[#0F172A] border-r  flex items-center gap-4 border-b border-base-300">
        <button onClick={() => navigate("/")} className="md:hidden p-2">
          <FaChevronLeft className="text-base-content" />
        </button>
        <div>
          <h2 className="text-lg font-bold text-base-content">
            {selectedUser?.username || "Пользователь не выбран"}
          </h2>
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
      </div>

      {/* Messages area */}
      <div className="flex-1 pl-5 pt-4 pr-16 pb-24 overflow-y-auto space-y-4">
        {chatMessages.map((msg, index) => {
          const isMe = msg.from === currentUser._id;
          return (
            <div
              key={index}
              className={`flex items-end gap-3 ${isMe ? "justify-end" : "justify-start"}`}
            >
              {/* Avatar left (for others) */}
              {!isMe && (
                <img
                  className="w-10 h-10 rounded-full ring-2 ring-primary object-cover"
                  src={selectedUser?.image || "https://via.placeholder.com/150"}
                  alt="avatar"
                />
              )}

              {/* Message container */}
              <div className={`max-w-[80%] ${isMe ? "text-right" : "text-left"}`}>
                <p className="text-xs font-semibold mb-1 text-base-content/60 truncate">
                  {isMe ? "Me" : selectedUser?.username}
                </p>

                <div
                  className={`inline-block px-4 py-2 rounded-2xl shadow-md transition-all whitespace-pre-wrap break-all
              bg-gradient-to-br
              ${isMe
                      ? "from-blue-600 via-blue-500 to-blue-400 text-white"
                      : "from-purple-600 via-purple-500 to-pink-500 text-white"}
            `}
                >
                  {msg.text}
                </div>

                <div className="text-[10px] text-base-content/50 mt-1">
                  {moment(msg.timestamp).calendar()}
                </div>
              </div>

              {/* Avatar right (for current user) */}
              {isMe && (
                <img
                  className="w-10 h-10 rounded-full ring-2 ring-secondary object-cover"
                  src={currentUser.image || "https://via.placeholder.com/150"}
                  alt="avatar"
                />
              )}
            </div>
          );
        })}

        {/* Scroll to bottom ref */}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-base-200 p-2 shadow-inner rounded-t-xl flex gap-3 items-center border-t border-base-300">
        <input
          type="text"
          placeholder="Xabar yozing..."
          className="w-full px-4 py-2 rounded-full bg-base-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
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
          className="btn btn-sm btn-circle bg-primary text-white hover:opacity-90"
        >
          <IoSendSharp size={18} />
        </button>
      </div>
    </div>

  );
};

export default Chat;
