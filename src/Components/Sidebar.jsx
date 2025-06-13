import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSelectedUser } from '../redux/slices/selectedUser';
import socket from '../socket';
import { FaPhoneSquareAlt } from 'react-icons/fa';
import { BsFillCalendarDateFill } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { MdOutlineDriveFileRenameOutline } from 'react-icons/md';
import moment from 'moment';
import { logout } from '../redux/slices/authSlice';


const Sidebar = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedModalUser, setSelectedModalUser] = useState(null);
  const [copied, setCopied] = useState(false);

  const [position, setPosition] = useState({ x: 0, y: 0 });

  const moveButton = () => {
    const x = Math.floor(Math.random() * 300) - 150;
    const y = Math.floor(Math.random() * 300) - 150;
    setPosition({ x, y });
  };



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

  const handleOpenChat = (malumot) => {
    if (malumot._id === user._id) {
      navigate('/favorites');
    } else {
      dispatch(setSelectedUser(malumot));
      navigate('/chat/' + malumot._id);
    }
  };

  const handleOpenModal = (malumot) => {
    setSelectedModalUser(malumot);
    document.getElementById('my_modal_1').showModal();
  };

  const handleCopy = async (phone) => {
    if (phone) {
      try {
        await navigator.clipboard.writeText(phone);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Ошибка копирования:', err);
        toast.error('Ошибка копирования номера');
      }
    }
  };

  const handleWarn = (userId) => {
    socket.emit('warn_user', { userId });

    socket.once('warn_result', (data) => {
      if (!data.success) {
        toast.error(data.message);
        return;
      }

      setSelectedModalUser(data.user);

      if (data.user.isBanned) {
        if (data.user._id === currentUser._id) {
          toast.error(`Вы были заблокированы (3/3), ${data.user.username}`);

        } else {
          toast.success(`Пользователь ${data.user.username} успешно заблокирован.`);
        }
      } else {
        toast.warn(`Предупреждение для ${data.user.username}: ${data.user.isWarn}/3`);
      }

    });
  };


  useEffect(() => {
    if (user?._id) {
      socket.emit("check_warns", { userId: user._id });

      socket.on("warn_status", (data) => {
        if (data.isBanned) {
          toast.error("Your account is banned");
          socket.emit("user_left", user);
          dispatch(logout());
          navigate("/login");
        } else if (data.isWarn > 0) {
          toast.warn(`You have ${data.isWarn}/3 warnings`);
        }
      });

      return () => {
        socket.off("warn_status");
      };
    }
  }, [user, dispatch, navigate]);

  const handleUnban = async (userId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/unban/${userId}`, {
        method: 'POST',
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || 'Ошибка разблокировки');
        return;
      }

      toast.success('Пользователь разблокирован');
      setSelectedModalUser(data.user);
    } catch (error) {
      console.error(error);
      toast.error('Ошибка разблокировки');
    }
  };

  useEffect(() => {
    if (!user || !user._id) return;

    socket.emit('user_joined', {
      _id: user._id,
      username: user.username,
      fullName: user.fullName,
      phone: user.phone,
      image: user.image,
      description: user.description,
      birthDate: user.birthDate,
    });

    const handleOnlineUsers = (users) => {
      console.log('Received online_users:', users);
      const filtered = users.filter((u) => u._id !== user._id);
      setOnlineUsers(filtered);
      setFilteredUsers(filtered);
      setLoading(false);
    };

    socket.on('online_users', handleOnlineUsers);

    const handleBeforeUnload = () => {
      socket.emit('user_left', user);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      socket.emit('user_left', user);
      socket.off('online_users', handleOnlineUsers);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [user]);

  const sortedUsers = [...filteredUsers].sort((a, b) =>
    b.status ? 1 : 0 - (a.status ? 1 : 0)
  );

  return (
    <div className="w-3/12 bg-base-300 overflow-y-auto p-2 h-screen flex-col flex py-5 ">
      <h2 className="text-xl font-bold mb-4 h-2/10">Online Users</h2>
      <label className="input mb-4 flex items-center gap-2 bg-base-200 rounded-full p-2 w-full shadow-md shadow-primary">
        <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
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
      <div className="flex items-center gap-1 justify-center flex-col w-full flex-1 cursor-pointer ">
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
              className="flex items-center flex-1 w-full gap-3 p-2 mb-2 bg-base-200 rounded cursor-pointer hover:bg-base-100 transition"
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
                          onMouseEnter={
                            selectedModalUser?._id === "683fe137f3ea00f9588fd673"
                              ? moveButton
                              : undefined
                          }

                          style={{
                            transform: `translate(${position.x}px, ${position.y}px)`,
                          }}
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
  );
};

export default Sidebar;
