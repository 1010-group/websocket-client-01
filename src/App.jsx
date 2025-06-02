import React, { useEffect, useState } from "react";
import socket from "./socket";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate, useParams, useLocation } from "react-router-dom";
import { setSelectedUser } from "./redux/slices/selectedUser";
import { MdMenu } from "react-icons/md";

const App = () => {
  const user = useSelector((state) => state.auth.user);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const isInsidePage =
    location.pathname.startsWith("/chat/") || location.pathname === "/favorites";

  useEffect(() => {
    if (!user || !user._id) return;

    socket.emit("user_joined", user);

    const handleOnlineUsers = (users) => {
      setOnlineUsers(users.filter((u) => u._id !== user._id));
      setLoading(false);
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

  const handleOpenChat = (malumot) => {
    if (malumot._id === user._id) {
      navigate("/favorites");
    } else {
      dispatch(setSelectedUser(malumot));
      navigate("/chat/" + malumot._id);
    }
  };

  const sortedUsers = [...onlineUsers].sort((a, b) => b.status - a.status);

  return (
    <div className="flex h-screen">
      {/* Left Sidebar - Online Users */}
      <div className="w-3/12 bg-base-300 overflow-y-auto p-2">
        <h2 className="text-xl font-bold mb-4">Online Users</h2>

        {loading ? (
          <div className="flex justify-center">
            <span className="loading loading-spinner text-primary"></span>
          </div>
        ) : sortedUsers.length === 0 ? (
          <p className="text-gray-400">Hozircha foydalanuvchilar yo‘q</p>
        ) : (
          sortedUsers.map((u) => (
            <div
              key={u._id}
              className="flex items-center gap-3 p-2 mb-2 bg-base-200 rounded cursor-pointer hover:bg-base-100 transition"
              onClick={() => handleOpenChat(u)}
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

      {/* Main Chat Area */}
      <div className="w-9/12 bg-base-100 flex justify-center items-center">
        {isInsidePage ? (
          <Outlet />
        ) : (
          <h1 className="text-3xl font-bold">Welcome to the Chat App!</h1>
        )}
      </div>

      {/* Drawer: My Profile */}
      <div className="fixed bottom-10 right-10 z-[999]">
        <div className="drawer">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            <label htmlFor="my-drawer" className="btn btn-primary drawer-button">
              <MdMenu />
            </label>
          </div>
          <div className="drawer-side">
            <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
            <div className="bg-base-200 text-base-content min-h-full w-80 p-4 space-y-4">
              <h2 className="text-lg font-semibold">Мой профиль</h2>

              <div className="flex items-center space-x-4">
                <img
                  src={user?.profilePic || "https://via.placeholder.com/64"}
                  alt="Avatar"
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <p className="text-xl font-light">{user?.fullname || "."}</p>
                  <p className="text-sm text-green-500">в сети</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 border-t pt-3">
                <span className="text-gray-500">📞</span>
                <div>
                  <p className="text-md">{user?.phone || "+998 97 000 00 00"}</p>
                  <p className="text-sm text-gray-500">Телефон</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-blue-500">@</span>
                <div>
                  <p className="text-md">{user?.username || "@username"}</p>
                  <p className="text-sm text-gray-500">Имя пользователя</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 border-t pt-3">
                <span className="text-gray-500">🕓</span>
                <div>
                  <p className="text-md">Архив историй</p>
                  <p className="text-sm text-gray-500">7</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t">
                <span className="text-sm">Tungi rejim</span>
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;