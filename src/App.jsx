import React, { useEffect, useState } from "react";
import socket from "./socket";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate, useParams, useLocation } from "react-router-dom";
import { setSelectedUser } from "./redux/slices/selectedUser";
import { MdLogout, MdMenu } from "react-icons/md";
import { logout } from "./redux/slices/authSlice";

const App = () => {
  const user = useSelector((state) => state.auth.user);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const handleLogout = () => {
    dispatch(logout())
  };

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
      <div className="fixed top-5 right-10 z-[999]">
        <div className="drawer">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            <label htmlFor="my-drawer" className="btn btn-primary drawer-button">
              <MdMenu />
            </label>
          </div>
          <div className="drawer-side">
            <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
            <div className="bg-base-200 text-base-content flex flex-col justify-between min-h-full w-80 p-4 space-y-4">
              <div className="flex flex-col gap-5">
                <div>
                  <h2 className="text-lg font-semibold">Мой профиль</h2>

                  <div className="flex items-center space-x-4">
                    <img
                      src={user?.image || "https://via.placeholder.com/64"}
                      alt="Avatar"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-lg font-semibold">{user?.fullName || "."}</p>
                      <p className="text-sm text-green-500">в сети</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-5 py-5 border-y ">
                  <div className="flex items-center space-x-3">
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

                  <div className="flex items-center space-x-3">
                    <span className="text-blue-500">❕</span>
                    <div>
                      <p className="text-md">{user?.description || "@username"}</p>
                      <p className="text-sm text-gray-500">О себе</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 ">
                    <span className="text-gray-500">🕓</span>
                    <div>
                      <p className="text-md">День рождения</p>
                      <p className="text-sm text-gray-500">{user?.birthDate || "Не указано"}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <button className="btn btn-error btn-soft w-full flex items-center gap-5" onClick={() => document.getElementById('my_modal_2').showModal()}>
                  <span>Выйти из аккаунта</span>
                  <span><MdLogout /></span>
                </button>
                <dialog id="my_modal_2" className="modal">
                  <div className="modal-box">
                    <h3 className="font-bold text-lg text-error text-center">Выйти из аккаунта</h3>
                    <p className="text-center py-8">Вы действительно хотите выйти из аккаунта?</p>

                    <div className="flex justify-center items-center gap-5">
                      <div>
                        <button className="btn btn-error btn-soft mr-5 min-w-[140px]" onClick={handleLogout}>Да</button>
                        <button className="btn btn-soft min-w-[140px]">Отмена</button>
                      </div>
                    </div>
                  </div>

                  <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                  </form>
                </dialog>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
