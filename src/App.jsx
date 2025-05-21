import React, { useEffect, useState } from "react";
import socket from "./socket";
import { useSelector } from "react-redux";

const App = () => {
  const user = useSelector((state) => state.auth.user);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ loading state

  useEffect(() => {
    if (!user || !user._id) return;

    // Foydalanuvchi socket orqali tizimga qo‘shildi
    socket.emit("user_joined", user);

    // Serverdan online foydalanuvchilarni olish
    const handleOnlineUsers = (users) => {
      setOnlineUsers(users);
      setLoading(false); // ✅ Ma'lumot kelgach loading tugaydi
    };

    socket.on("online_users", handleOnlineUsers);

    const handleBeforeUnload = () => {
      socket.emit("user_left", user);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      socket.emit("user_left", user);
      socket.off("online_users", handleOnlineUsers);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [user]);

  return (
    <div className="flex h-screen">
      <div className="w-3/12 bg-base-300 overflow-y-auto p-2">
        <h2 className="text-xl font-bold mb-4">Online Users</h2>

        {loading ? (
          <div className="flex justify-center">
            <span className="loading loading-spinner text-primary"></span>
          </div>
        ) : onlineUsers.length === 0 ? (
          <p className="text-gray-400">Hozircha foydalanuvchilar yo‘q</p>
        ) : (
          onlineUsers.map((u) => (
            <div
              key={u._id}
              className="flex items-center gap-3 p-2 mb-2 bg-base-200 rounded"
            >
              <img
                className="w-12 h-12 rounded-full"
                src={
                  u.profilePic ||
                  "https://static.vecteezy.com/system/resources/thumbnails/028/149/256/small_2x/3d-user-profile-icon-png.png"
                }
                alt={u.username}
              />
              <div>
                <p className="font-semibold">{u.username}</p>
                <p className={u.status ? "text-green-500" : "text-red-500"}>
                  {u.status ? "Online" : "Offline"}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="w-9/12 bg-base-100 flex justify-center items-center">
        <h1 className="text-3xl font-bold">Welcome to the Chat App!</h1>
      </div>
    </div>
  );
};

export default App;
