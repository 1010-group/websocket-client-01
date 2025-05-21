import React, { useEffect, useState } from 'react';
import socket from './socket';
import { useSelector } from 'react-redux';

const App = () => {
  const user = useSelector(state => state.auth.user);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!user || !user._id) return;

    socket.emit("user_joined", user);

    const handleOnlineUsers = (users) => {
      setOnlineUsers(users);
    };

    const handleBeforeUnload = () => {
      socket.emit("user_left", user._id);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    socket.on("online_users", handleOnlineUsers);

    return () => {
      socket.emit("user_left", user._id);
      socket.off("online_users", handleOnlineUsers);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [user]);

  return (
    <div className="flex h-screen">
      <div className="w-3/12 bg-base-300 overflow-y-auto">
      {onlineUsers.map((u) => (
  <div key={u._id} className="flex gap-4 p-2 bg-base-200 items-center">
    <img className="w-12 h-12 rounded-full" src={u.profilePic || "https://static.vecteezy.com/system/resources/thumbnails/028/149/256/small_2x/3d-user-profile-icon-png.png"} />
    <div>
      <p>{u.username}</p>
      <p className={u.online ? "text-success" : "text-error"}>
        {u.online ? "Online" : "Offline"}
      </p>
    </div>
  </div>
))}
      </div>
      <div className="w-9/12 bg-base-100"></div>
    </div>
  );
};

export default App;
