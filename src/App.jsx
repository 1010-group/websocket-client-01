import React, { useEffect, useState } from "react";
import socket from "./socket";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { setSelectedUser } from "./redux/slices/selectedUser";
import { useLocation } from "react-router-dom";
import { MdMenu } from "react-icons/md";


const App = () => {
  const user = useSelector((state) => state.auth.user);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const isChatPage = location.pathname.startsWith("/chat/");
  const isFavoritesPage = location.pathname === "/favorites";
  const isInsidePage = location.pathname.startsWith("/chat/") || location.pathname === "/favorites";
  const [chatMessages, setChatMessages] = useState([]);
  console.log("USER:", user)

  useEffect(() => {
    if (!user || !user._id) return;

    socket.emit("user_joined", user);

    const handleOnlineUsers = (users) => {
      setOnlineUsers(users);
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

  const handleOnlineUsers = (users) => {
    const filtered = users.filter((u) => u._id !== user._id);
    setOnlineUsers(filtered);
    setLoading(false);
  };



  const sortedUsers = [...onlineUsers].sort((a, b) => b.status - a.status);

  return (
    <div className="flex h-screen">
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

      <div className="w-9/12 bg-base-100 flex justify-center items-center">
        {isInsidePage ? (
          <Outlet />
        ) : (
          <h1 className="text-3xl font-bold">Welcome to the Chat App!</h1>
        )}
      </div>

      <div className="fixed bottom-16 right-2 z-[999]">
        <div className="drawer">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            {/* Page content here */}
            <label htmlFor="my-drawer" className="btn btn-primary drawer-button"><MdMenu /></label>
          </div>
          <div className="drawer-side">
            <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
            <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
              {/* Sidebar content here */}
              <li><a>Sidebar Item 1</a></li>
              <li><a>Sidebar Item 2</a></li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
};

export default App;
