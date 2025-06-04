import React, { useEffect, useState } from "react";
import socket from "./socket";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate, useParams, useLocation } from "react-router-dom";
import { setSelectedUser } from "./redux/slices/selectedUser";
import { MdLogout, MdMenu, MdInfoOutline } from "react-icons/md";

const App = () => {
  const user = useSelector((state) => state.auth.user);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showUserDrawer, setShowUserDrawer] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
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

  const handleShowProfile = (malumot) => {
    setSelectedProfile(malumot);
    setShowUserDrawer(true);
  };

  const handleLogout = () => {
    // logout logikasini bu yerga yozing
    console.log("Logged out");
    navigate("/login"); // kerakli sahifaga yo‘naltiring
  };

  const sortedUsers = [...onlineUsers].sort((a, b) => b.status - a.status);

  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
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
              <div className="flex-1">
                <p className="font-semibold">{u.username}</p>
                <p className={u.status ? "text-green-500" : "text-red-500"}>
                  {u.status ? "Online" : "Offline"}
                </p>
              </div>
              <button
                className="btn btn-ghost btn-sm"
                onClick={(e) => {
                  e.stopPropagation(); // Prevents triggering handleOpenChat when clicking info
                  handleShowProfile(u);
                }}
              >
                <MdInfoOutline className="text-blue-500 text-xl" />
              </button>
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
                  <h2 className="text-lg font-semibold">My profile</h2>
                  <div className="flex items-center space-x-4 mt-4">
                    <img
                      src={user?.image || "https://via.placeholder.com/64"}
                      alt="Avatar"
                      className="w-16 h-16 bg-base-300 p-2 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-lg font-semibold">{user?.fullName || "."}</p>
                      <p className="text-sm text-green-500">Online</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-5 py-5 border-y ">
                  {/* Phone */}
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-500">📞</span>
                    <div>
                      <p className="text-md">{user?.phone || "+998 97 000 00 00"}</p>
                      <p className="text-sm text-gray-500">Telephone</p>
                    </div>
                  </div>

                  {/* Username */}
                  <div className="flex items-center space-x-3">
                    <span className="text-blue-500">@</span>
                    <div>
                      <p className="text-md">{user?.username || "@username"}</p>
                      <p className="text-sm text-gray-500">Username</p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="flex items-center space-x-3">
                    <span className="text-blue-500">❕</span>
                    <div>
                      <p className="text-md">{user?.description || "@alihan"}</p>
                      <p className="text-sm text-gray-500">About me</p>
                    </div>
                  </div>

                  {/* BirthDate */}
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-500">🕓</span>
                    <div>
                      <p className="text-md">Birthday</p>
                      <p className="text-sm text-gray-500">{user?.birthDate || "08.11.2013"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <button
                  className="btn btn-error btn-soft w-full flex items-center gap-5"
                  onClick={() => setShowLogoutModal(true)}
                >
                  <span>Выйти из системы</span>
                  <span><MdLogout /></span>
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Drawer: Other User Profile */}
      {showUserDrawer && selectedProfile && (
        <div className="fixed top-0 right-0 z-[1000]">
          <div className="drawer drawer-end">
            <input id="user-drawer" type="checkbox" className="drawer-toggle" checked={showUserDrawer} />
            <div className="drawer-side">
              <label
                htmlFor="user-drawer"
                aria-label="close sidebar"
                className="drawer-overlay"
                onClick={() => setShowUserDrawer(false)}
              ></label>
              <div className="bg-base-200 text-base-content flex flex-col min-h-full w-80 p-4 space-y-4">
                <div className="flex flex-col gap-5">
                  <div>
                    <h2 className="text-lg font-semibold">{selectedProfile.username}'s Profile</h2>
                    <div className="flex items-center space-x-4">
                      <img
                        src={
                          selectedProfile.profilePic ||
                          "https://static.vecteezy.com/system/resources/thumbnails/028/149/256/small_2x/3d-user-profile-icon-png.png"
                        }
                        alt={selectedProfile.username}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-lg font-semibold">{selectedProfile.username}</p>
                        <p className={selectedProfile.status ? "text-green-500" : "text-red-500"}>
                          {selectedProfile.status ? "Online" : "Offline"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-5 py-5 border-y">
                    {/* Phone */}
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-500">📞</span>
                      <div>
                        <p className="text-md">{selectedProfile.phone || "+998 97 000 00 00"}</p>
                        <p className="text-sm text-gray-500">Telephone</p>
                      </div>
                    </div>

                    {/* Username */}
                    <div className="flex items-center space-x-3">
                      <span className="text-blue-500">@</span>
                      <div>
                        <p className="text-md">{selectedProfile.username || "@username"}</p>
                        <p className="text-sm text-gray-500">Username</p>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="flex items-center space-x-3">
                      <span className="text-blue-500">❕</span>
                      <div>
                        <p className="text-md">{selectedProfile.description || "No description"}</p>
                        <p className="text-sm text-gray-500">About me</p>
                      </div>
                    </div>
                  </div>

                  {
                    user.role !== "user" && (
                      <div>
                        <p>Панель для админстратора</p>
                        <div сlassName="flex flex-col gap-2 space-y-1">
                          <button className="btn btn-soft btn-error w-full">Заблокировать</button>
                          <button className="btn btn-soft btn-error w-full">Заглушить</button>
                          <button className="btn btn-soft btn-error w-full">Предупреждение</button>
                        </div>
                      </div>

                    )
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-base-100 p-6 rounded-lg shadow-lg space-y-4 w-[90%] max-w-md">
            <h3 className="text-lg font-semibold">Are you sure you want to log out of your account?</h3>
            <div className="flex justify-end gap-4">
              <button className="btn btn-outline" onClick={() => setShowLogoutModal(false)}>no</button>
              <button className="btn btn-error" onClick={handleLogout}>yes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
