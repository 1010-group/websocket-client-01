import React, { useEffect, useState } from "react";
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

const App = () => {
  const user = useSelector((state) => state.auth.user);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [copied, setCopied] = useState(false);
  const [selectedModalUser, setSelectedModalUser] = useState(null); // State to store the user for the modal

  const handleCopy = async (phone) => {
    if (phone) {
      try {
        await navigator.clipboard.writeText(phone);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Ошибка копирования:", err);
      }
    }
  };

  const isInsidePage =
    location.pathname.startsWith("/chat/") || location.pathname === "/favorites";

  useEffect(() => {
    if (!user || !user._id) return;

    socket.emit("user_joined", {
      _id: user._id,
      username: user.username,
      fullName: user.fullName,
      phone: user.phone,
      profilePic: user.image,
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
      setOnlineUsers(users.filter((u) => u._id !== user._id));
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

  const handleOpenChat = (malumot) => {
    if (malumot._id === user._id) {
      navigate("/favorites");
    } else {
      dispatch(setSelectedUser(malumot));
      navigate("/chat/" + malumot._id);
    }
  };

  const handleOpenModal = (malumot) => {
    setSelectedModalUser(malumot); // Set the selected user for the modal
    document.getElementById("my_modal_1").showModal(); // Open the modal
  };

  const sortedUsers = [...onlineUsers].sort((a, b) =>
    b.status ? 1 : 0 - (a.status ? 1 : 0)
  );

  const handleLogout = () => {
    dispatch(logout());
  };
  console.log(sortedUsers)
  return (
    <div className="flex h-screen">
      {/* Left Sidebar - Online Users */}
      <div className="w-3/12 bg-base-300 overflow-y-auto p-2 h-screen flex-col flex py-5">
        <h2 className="text-xl font-bold mb-4 h-2/10">Online Users</h2>
        <div className="flex items-center gap-1 justify-center flex-col w-full">
          {loading ? (
            <div className="flex justify-center items-center flex-1 h-8/10">
              <span className="loading loading-spinner text-primary"></span>
            </div>
          ) : sortedUsers.length === 0 ? (
            <p className="text-gray-400">Hozircha foydalanuvchilar yo‘q</p>
          ) : (
            sortedUsers.map((u) => (
              <div
                key={u._id}
                className="flex items-center flex-1 w-full gap-3 p-2 mb-2 bg-base-200 rounded cursor-pointer hover:bg-base-100 transition"
                onClick={() => handleOpenChat(u)}
              >
                <button onClick={() => handleOpenModal(u)}>
                  <img
                    className="w-12 h-12 rounded-full"
                    src={
                      u.profilePic ||
                      "https://static.vecteezy.com/system/resources/thumbnails/028/149/256/small_2x/3d-user-profile-icon-png.png"
                    }
                    alt={u.username}
                  />
                </button>
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
      </div>

      {/* Main Chat Area */}
      <div className="w-9/12 bg-base-100 flex justify-center items-center">
        {isInsidePage ? (
          <Outlet />
        ) : (
          <h1 className="text-3xl font-bold">Welcome to the Chat App!</h1>
        )}
      </div>

      {/* Drawer */}
      <div className="fixed top-5 right-10 z-[999] flex items-center gap-4">
        <label className="toggle text-base-content">
          <input type="checkbox" value="dark" className="theme-controller" />
          <svg
            aria-label="sun"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="12" cy="12" r="4"></circle>
              <path d="M12 2v2"></path>
              <path d="M12 20v2"></path>
              <path d="m4.93 4.93 1.41 1.41"></path>
              <path d="m17.66 17.66 1.41 1.41"></path>
              <path d="M2 12h2"></path>
              <path d="M20 12h2"></path>
              <path d="m6.34 17.66-1.41 1.41"></path>
              <path d="m19.07 4.93-1.41 1.41"></path>
            </g>
          </svg>
          <svg
            aria-label="moon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2"
              fill="none"
              stroke="currentColor"
            >
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
            </g>
          </svg>
        </label>
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
                      <BsFillCalendarDateFill className="inline-block text-amber-500 text-2xl" />
                      <p className="text-amber-500">
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
                  <span>Выйти из аккаунта</span>
                  <MdLogout size={20} />
                </button>

                <dialog id="my_modal_2" className="modal">
                  <div className="modal-box bg-[#0a0a23] border border-neonRed rounded-lg shadow-neon-red text-neonRed">
                    <h3 className="font-bold text-lg text-center mb-4">
                      Выйти из аккаунта
                    </h3>
                    <p className="text-center py-6">
                      Вы действительно хотите выйти из аккаунта?
                    </p>
                    <div className="flex justify-center gap-6">
                      <button
                        className="btn bg-neonRed hover:bg-red-600 text-black font-bold shadow-neon-red min-w-[140px]"
                        onClick={handleLogout}
                      >
                        Да
                      </button>
                      <button
                        className="btn bg-neonCyan hover:bg-cyan-400 text-black font-bold shadow-neon-cyan min-w-[140px]"
                        onClick={() =>
                          document.getElementById("my_modal_2").close()
                        }
                      >
                        Отмена
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
                                selectedModalUser?.profilePic ||
                                user?.image ||
                                "https://static.vecteezy.com/system/resources/thumbnails/028/149/256/small_2x/3d-user-profile-icon-png.png"
                              }
                              alt={selectedModalUser?.username || user?.username}
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
                                    (selectedModalUser?.status )
                                      ? "text-success font-semibold text-shadow-neon-cyan"
                                      : "text-error font-semibold text-shadow-neon-red"
                                  }
                                >
                                  {(selectedModalUser?.status ) ? "Online" : "Offline"}
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
                                <BsFillCalendarDateFill className="inline-block text-amber-500 text-2xl" />
                                <p className="text-amber-500">
                                  {selectedModalUser?.birthDate || user?.birthDate
                                    ? new Date(selectedModalUser?.birthDate || user?.birthDate).toLocaleDateString("en-CA")
                                    : "-"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <button className="btn btn-error text-white">Close</button>
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