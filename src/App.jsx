import React, { useEffect, useState, useRef } from "react";
import socket from "./socket";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate, useParams, useLocation } from "react-router-dom";
import { setSelectedUser } from "./redux/slices/selectedUser";
import { MdLogout, MdMenu } from "react-icons/md";
import { logout, updateUserStatus } from "./redux/slices/authSlice";
import { BsFillCalendarDateFill } from "react-icons/bs";
import { FaPhoneSquareAlt } from "react-icons/fa";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { IoSettingsSharp } from "react-icons/io5";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoNotifications } from "react-icons/io5";
import { Howl } from "howler";

// Импортируйте аудиофайлы из src/assets/sounds
import notificationSound from "./assets/notification.wav";
import errorSound from "./assets/error.wav";

const App = () => {
  const user = useSelector((state) => state.auth.user);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [copied, setCopied] = useState(false);
  const [selectedModalUser, setSelectedModalUser] = useState(null);
  const [theme, setTheme] = useState("default");

  // Ссылки на объекты Howl для управления звуками
  const notificationSoundRef = useRef(null);
  const errorSoundRef = useRef(null);

  // Инициализация звуков в useEffect
  useEffect(() => {
    notificationSoundRef.current = new Howl({
      src: [notificationSound], // Или '/sounds/notification.mp3' для public
      volume: 0.5,
      preload: true,
      onloaderror: (id, error) => {
        console.error("Ошибка загрузки звука уведомления:", error);
        toast.error("Не удалось загрузить звук уведомления");
      },
    });

    errorSoundRef.current = new Howl({
      src: [errorSound], // Или '/sounds/error.mp3' для public
      volume: 0.5,
      preload: true,
      onloaderror: (id, error) => {
        console.error("Ошибка загрузки звука ошибки:", error);
        toast.error("Не удалось загрузить звук ошибки");
      },
    });

    // Очистка при размонтировании компонента
    return () => {
      notificationSoundRef.current?.unload();
      errorSoundRef.current?.unload();
    };
  }, []);

  // Воспроизведение звука уведомления
  const playNotificationSound = () => {
    if (notificationSoundRef.current) {
      notificationSoundRef.current.play();
    }
  };

  // Воспроизведение звука ошибки
  const playErrorSound = () => {
    if (errorSoundRef.current) {
      errorSoundRef.current.play();
    }
  };

  // Fetch notifications
  useEffect(() => {
    if (!user?._id) return;
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/notifications/${user._id}`);
        if (!res.ok) throw new Error("Ошибка при загрузке уведомлений");
        const data = await res.json();
        setNotifications(data);
      } catch (err) {
        console.error("Ошибка загрузки уведомлений:", err);
        toast.error("Ошибка загрузки уведомлений");
        playErrorSound();
      }
    };
    fetchNotifications();
  }, [user]);

  // Listen for new notifications
  useEffect(() => {
    socket.on("new_notification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      toast.info(notification.message);
      playNotificationSound();
    });

    return () => {
      socket.off("new_notification");
    };
  }, []);


  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/notifications/read/${notificationId}`, {
        method: "PUT",
      });
      if (!res.ok) throw new Error("Ошибка при отметке уведомления как прочитанного");
      const updatedNotification = await res.json();
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === updatedNotification._id ? updatedNotification : notif
        )
      );
    } catch (err) {
      console.error("Ошибка при отметке уведомления:", err);
      toast.error("Ошибка при отметке уведомления");
      playErrorSound();
    }
  };

  // Handle search input
  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredUsers(onlineUsers);
      return;
    }
    const filtered = onlineUsers.filter((u) =>
      u.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleCopy = async (phone) => {
    if (phone) {
      try {
        await navigator.clipboard.writeText(phone);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Ошибка копирования:", err);
        toast.error("Ошибка копирования номера");
        playErrorSound();
      }
    }
  };

  // Socket connection and online users
  useEffect(() => {
    if (!user || !user._id) return;

    socket.emit("user_joined", {
      _id: user._id,
      username: user.username,
      fullName: user.fullName,
      phone: user.phone,
      image: user.image,
      description: user.description,
      birthDate: user.birthDate,
    });

    socket.on("connect", () => {
      dispatch(updateUserStatus(true));
    });

    socket.on("disconnect", () => {
      dispatch(updateUserStatus(false));
    });

    const handleOnlineUsers = (users) => {
      console.log("Received online_users:", users);
      const filtered = users.filter((u) => u._id !== user._id);
      setOnlineUsers(filtered);
      setFilteredUsers(filtered);
      setLoading(false);
    };

    socket.on("online_users", handleOnlineUsers);

    const handleBeforeUnload = () => {
      socket.emit("user_left", user);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    dispatch(updateUserStatus(true));

    return () => {
      socket.emit("user_left", user);
      socket.off("online_users", handleOnlineUsers);
      socket.off("connect");
      socket.off("disconnect");
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [user, dispatch]);

  const handleWarn = (userId) => {
    socket.emit("warn_user", { userId });

    socket.once("warn_result", (data) => {
      if (!data.success) {
        toast.error(data.message);
        playErrorSound();
        return;
      }

      setSelectedModalUser(data.user);

      if (data.user.isBanned) {
        toast.error(`Пользователь ${data.user.username} заблокирован (3/3)`);
      } else {
        toast.warn(`Предупреждение для ${data.user.username}: ${data.user.isWarn}/3`);
      }
    });
  };

  const handleUnban = async (userId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/unban/${userId}`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Ошибка разблокировки");
        playErrorSound();
        return;
      }

      toast.success("Пользователь разблокирован");
      setSelectedModalUser(data.user);
    } catch (error) {
      console.error(error);
      toast.error("Ошибка разблокировки");
      playErrorSound();
    }
  };

  useEffect(() => {
    if (user?._id) {
      socket.emit("check_warns", { userId: user._id });


      socket.on("warn_status", (data) => {
        if (data.isBanned) {
          toast.error("Ваш аккаунт заблокирован");
          socket.emit("user_left", user);
          dispatch(logout());
          navigate("/login");
        } else if (data.isWarn > 0) {
          toast.warn(`У вас ${data.isWarn}/3 предупреждений`);
        }
      });

      return () => {
        socket.off("warn_status");
      };
    }
  }, [user, dispatch, navigate]);

  const handleOpenChat = (malumot) => {
    if (malumot._id === user._id) {
      navigate("/favorites");
    } else {
      dispatch(setSelectedUser(malumot));
      navigate("/chat/" + malumot._id);
    }
  };

  const handleOpenModal = (malumot) => {
    setSelectedModalUser(malumot);
    document.getElementById("my_modal_1").showModal();
  };

  const sortedUsers = [...filteredUsers].sort((a, b) =>
    b.status ? 1 : 0 - (a.status ? 1 : 0)
  );

  const handleLogout = () => {
    socket.emit("user_left", user);
    dispatch(logout());
    navigate("/login");
  };

  const unreadCount = notifications.filter((notif) => !notif.read).length;

  return (
    <div className="flex h-screen">
      {/* Left Sidebar - Online Users */}
      <div className="w-3/12 bg-base-300 overflow-y-auto p-2 h-screen flex-col flex py-5">
        <h2 className="text-xl font-bold mb-4 h-2/10">Online Users</h2>
        <label className="input mb-4 flex items-center gap-2 bg-base-200 rounded-full p-2 w-full shadow-md shadow-primary">
          <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input
            type="search"
            required
            placeholder="Search"
            onChange={(e) => handleSearch(e.target.value)}
          />
        </label>
        <div className="flex items-center gap-1 justify-center flex-col w-full flex-1">
          {loading ? (
            <div className="flex justify-center items-center flex-1 h-8/10">
              <span className="loading loading-infinity loading-xl"></span>
            </div>
          ) : sortedUsers.length === 0 ? (
            <p className="text-gray-400">No users online yet</p>
          ) : (
            sortedUsers.map((u) => (
              <div
                key={u._id}
                className="flex items-center flex-1 w-full gap-3 p-2 mb-2 bg-base-200 rounded cursor-pointer hover:bg-base-100 transition "
                onClick={() => handleOpenChat(u)}
              >
                <button onClick={(e) => { e.stopPropagation(); handleOpenModal(u); }}>
                  <img
                    className="w-12 h-12 rounded-full"
                    src={u.image || "https://static.vecteezy.com/system/resources/thumbnails/028/149/256/small_2x/3d-user-profile-icon-png.png"}
                    alt={u.username}
                  />
                </button>
                <div>
                  <p className="font-semibold text-primary">{u.username}</p>
                  <p className={u.status ? "text-success" : "text-error"}>
                    {u.status ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="w-9/12 bg-base-100 flex justify-center items-center">
        {location.pathname.startsWith("/chat/") || location.pathname === "/favorites" ? (
          <Outlet />
        ) : (
          <h1 className="text-3xl font-bold">Welcome to the Chat App!</h1>
        )}
      </div>


      {/* Drawer and Notifications */}
      <div className="fixed top-5 right-10 z-[999] flex items-center gap-4">
        {/* Notifications Dropdown */}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn m-1 w-20 h-10 relative">
            <IoNotifications size={24} />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-80 p-2 shadow-md shadow-primary max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <li><p className="text-gray-400">No notifications</p></li>
            ) : (
              notifications.map((notif) => (
                <li
                  key={notif._id}
                  className={`p-2 border-b ${notif.read ? 'bg-base-200' : 'bg-base-100'} hover:bg-base-300 cursor-pointer`}
                  onClick={() => !notif.read && markAsRead(notif._id)}
                >
                  <div className="flex items-center gap-2">
                    <img
                      className="w-8 h-8 rounded-full"
                      src={notif.fromUser?.image || "https://static.vecteezy.com/system/resources/thumbnails/028/149/256/small_2x/3d-user-profile-icon-png.png"}
                      alt={notif.fromUser?.username || "System"}
                    />
                    <div>
                      <p className="font-semibold">{notif.fromUser?.username || "System"}</p>
                      <p className="text-sm">{notif.message}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(notif.timestamp).toLocaleString()}
                      </p>
                    </div>
                    {!notif.read && (
                      <span className="ml-auto bg-blue-500 h-2 w-2 rounded-full"></span>
                    )}
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>


        {/* Theme Dropdown */}
        <div className="dropdown dropdown-start">
          <div tabIndex={0} role="button" className="btn m-1 w-20 h-10">{theme}</div>
          <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-45 p-2 shadow-md shadow-primary">
            <div className="join join-vertical w-full">
              <input
                type="radio"
                name="theme-buttons"
                className="btn theme-controller join-item"
                aria-label="Default"
                value="default"
                onChange={(e) => setTheme(e.target.value)}
              />
              <input
                type="radio"
                name="theme-buttons"
                className="btn theme-controller join-item"
                aria-label="Luxury"
                value="luxury"
                onChange={(e) => setTheme(e.target.value)}
              />
              <input
                type="radio"
                name="theme-buttons"
                className="btn theme-controller join-item"
                aria-label="Retro"
                value="retro"
                onChange={(e) => setTheme(e.target.value)}
              />
              <input
                type="radio"
                name="theme-buttons"
                className="btn theme-controller join-item"
                aria-label="Synthwave"
                value="synthwave"
                onChange={(e) => setTheme(e.target.value)}
              />
              <input
                type="radio"
                name="theme-buttons"
                className="btn theme-controller join-item"
                aria-label="Silk"
                value="silk"
                onChange={(e) => setTheme(e.target.value)}
              />
              <input
                type="radio"
                name="theme-buttons"
                className="btn theme-controller join-item"
                aria-label="Sunset"
                value="sunset"
                onChange={(e) => setTheme(e.target.value)}
              />
            </div>
          </ul>
        </div>


        {/* Drawer */}
        <div className="drawer">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            <label
              htmlFor="my-drawer"
              className="btn bg-neonCyan hover:bg-cyan-400 shadow-neon-cyan transition duration-300 drawer-button"
            >
              <IoSettingsSharp size={24} />
            </label>
          </div>
          <div className="drawer-side">
            <label
              htmlFor="my-drawer"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <div className="backdrop-blur-md w-3/12 shadow-2xl shadow-cyan-500 text-neonCyan flex flex-col justify-between min-h-full p-6 space-y-6 shadow-neon-cyan rounded-lg">
              <div className="flex flex-col gap-6">
                <div className="flex gap-4 flex-col">
                  <img
                    className="w-14 h-14 rounded-full border-2 border-cyan-600 shadow-cyan-600 shadow-2xl"
                    src={
                      user?.image ||
                      "https://static.vecteezy.com/system/resources/thumbnails/028/149/256/small_2x/3d-user-profile-icon-png.png"
                    }
                    alt={user?.username}
                  />
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <MdOutlineDriveFileRenameOutline className="text-primary text-2xl" />
                      <p className="font-bold text-lg text-shadow-cyan-600 text-primary">
                        {user?.username}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        aria-label="success"
                        className="status status-success"
                      ></div>
                      <p
                        className={
                          user?.status
                            ? "text-success font-semibold text-shadow-neon-cyan"
                            : "text-error font-semibold text-shadow-neon-red"
                        }
                      >
                        {user?.status ? "Online" : "Offline"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 group duration-300">
                      <div
                        className="hidden group-hover:flex items-center gap-2 cursor-pointer duration-300"
                        onClick={() => handleCopy(user?.phone)}
                      >
                        <div className="text-success text font-black duration-300">
                          {copied ? "Copied!" : "Copy"}
                        </div>
                      </div>
                      <FaPhoneSquareAlt className="text-success text-2xl" />
                      <a href={`tel:${user?.phone}`} className="text-success">
                        {user?.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <BsFillCalendarDateFill className="inline-block text-secondary text-shadow-sm text-shadow-secondary text-2xl" />
                      <p className="text-secondary text-shadow-sm text-shadow-secondary">
                        {user?.birthDate
                          ? new Date(user.birthDate).toLocaleDateString("en-CA")
                          : "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <button
                  className="btn w-full flex items-center gap-3 justify-center hover:bg-red-600 font-bold shadow-neon-red rounded-lg transition duration-300"
                  onClick={() => document.getElementById("my_modal_2").showModal()}
                >
                  <span>Log out</span>
                  <MdLogout size={20} />

                </button>

                <dialog id="my_modal_2" className="modal">
                  <div className="modal-box bg-[#0a0a23] border border-neonRed rounded-lg shadow-neon-red text-neonRed">
                    <h3 className="font-bold text-lg text-center mb-4">
                      Log out of account
                    </h3>
                    <p className="text-center py-6">
                      Are you sure you want to log out?
                    </p>
                    <div className="flex justify-center gap-6">
                      <button
                        className="btn bg-neonRed hover:bg-red-600 text-black font-bold shadow-neon-red min-w-[140px]"
                        onClick={handleLogout}
                      >
                        Yes
                      </button>
                      <button
                        className="btn bg-neonCyan hover:bg-cyan-400 text-black font-bold shadow-neon-cyan min-w-[140px]"
                        onClick={() =>
                          document.getElementById("my_modal_2").close()
                        }
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                  <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                  </form>
                </dialog>

                {/* Modal for User Profile */}
                <dialog id="my_modal_1" className="modal">
                  <div className="modal-box flex mb-4">
                    <div className="modal-action">
                      <form method="dialog">
                        <div className="flex flex-col gap-6 mb-4">
                          <div className="flex gap-4 flex-col">
                            <img
                              className="w-14 h-14 rounded-full border-2 border-cyan-600 shadow-cyan-600 shadow-2xl"
                              src={
                                selectedModalUser?.image ||
                                "https://static.vecteezy.com/system/resources/thumbnails/028/149/256/small_2x/3d-user-profile-icon-png.png"
                              }
                              alt={selectedModalUser?.username}
                            />
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-2">
                                <MdOutlineDriveFileRenameOutline className="text-primary text-2xl" />
                                <p className="font-bold text-lg text-shadow-cyan-600 text-primary">
                                  {selectedModalUser?.username || user?.username}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <div
                                  aria-label={selectedModalUser?.status ? "success" : "error"}
                                  className={
                                    selectedModalUser?.status
                                      ? "status status-success"
                                      : "status status-error"
                                  }
                                ></div>
                                <p
                                  className={
                                    selectedModalUser?.status
                                      ? "text-success font-semibold text-shadow-success"
                                      : "text-error font-semibold text-shadow-error"
                                  }
                                >
                                  {selectedModalUser?.status ? "Online" : "Offline"}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 group duration-300">
                                <div

                                  className="hidden group-hover:flex items-center gap-2 cursor-pointer duration-300"
                                  onClick={() => handleCopy(selectedModalUser?.phone || user?.phone)}
                                >
                                  <div className="text-success text font-black duration-300">
                                    {copied ? "Copied!" : "Copy"}
                                  </div>
                                </div>
                                <FaPhoneSquareAlt className="text-success text-2xl" />
                                <a
                                  href={`tel:${selectedModalUser?.phone || user?.phone}`}
                                  className="text-success"
                                >
                                  {selectedModalUser?.phone || user?.phone}
                                </a>
                              </div>
                              <div className="flex items-center gap-2">
                                <BsFillCalendarDateFill className="inline-block text-secondary text-2xl" />
                                <p className="text-secondary">
                                  {selectedModalUser?.birthDate || user?.birthDate
                                    ? new Date(selectedModalUser?.birthDate || user?.birthDate).toLocaleDateString("en-CA")
                                    : "-"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-4">
                          {user.role !== "user" && (
                            <div className="flex flex-col items-start gap-4">
                              <p className="text-2xl text-accent font-semibold text-shadow-sm text-shadow-accent">
                                Admin Panel
                              </p>
                              <div className="flex flex-col gap-2 sm:w-72">
                                <button className="btn btn-soft btn-error w-full m-1">
                                  Ban
                                </button>
                                <button className="btn btn-soft btn-error w-full m-1">
                                  Mute
                                </button>
                                {!selectedModalUser?.isBanned && (
                                  <button
                                    className="btn btn-soft btn-error w-full m-1"
                                    onClick={() => handleWarn(selectedModalUser._id)}
                                  >
                                    Warning ({selectedModalUser?.isWarn || 0}/3)
                                  </button>
                                )}
                                <button
                                  className="btn btn-soft btn-success w-full m-1"
                                  onClick={() => handleUnban(selectedModalUser._id)}
                                >
                                  Unban
                                </button>
                              </div>
                            </div>
                          )}
                          <button className="btn btn-error text-white w-72">Close</button>
                        </div>
                      </form>
                    </div>
                  </div>
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
