import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSelectedUser } from '../redux/slices/selectedUser';
import socket from '../socket';
import { toast } from 'react-toastify';
import { logout } from '../redux/slices/authSlice';
import { setOnlineUsers } from "../redux/slices/onlineUsers";
import SearchBar from './SidebarComponents/SearchBar';
import UserProfileModal from './SidebarComponents/UserProfileModal';
import UserList from './SidebarComponents/UserList';

const Sidebar = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedModalUser, setSelectedModalUser] = useState(null);
  const [isChangingRole, setIsChangingRole] = useState(false);
  const onlineUsers = useSelector(state => state?.onlineUsers?.onlineUsers);
  const [copied, setCopied] = useState(false);


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

  const handleKick = (fromID, toID) => {
    socket.emit("kick_user", {
      userId: fromID,
      selectedId: toID,
    });

    socket.once("kick_result", (data) => {
      toast[data.success ? 'success' : 'error'](data.message);
      if (data.success && toID === user._id) {
        dispatch(logout());
        navigate('/login');
      }
    });
  };

  useEffect(() => {
    socket.on("kick_user", ({ message }) => {
      toast.error(message || "Siz kick qilindingiz");
      dispatch(logout());
      navigate('/login');
    });

    return () => {
      socket.off("kick_user");
    };
  }, []);



  const handleWarn = (userId) => {
    socket.emit('warn_user', { userId });

    socket.once('warn_result', (data) => {
      if (!data.success) {
        toast.error(data.message);
        return;
      }

      setSelectedModalUser(data.user);
      setOnlineUsers((prev) =>
        prev.map((u) => (u._id === data.user._id ? { ...u, isWarn: data.user.isWarn, isBanned: data.user.isBanned } : u))
      );
      setFilteredUsers((prev) =>
        prev.map((u) => (u._id === data.user._id ? { ...u, isWarn: data.user.isWarn, isBanned: data.user.isBanned } : u))
      );

      if (data.user.isBanned) {
        if (data.user._id === user._id) {
          toast.error(`Вы были заблокированы (3/3), ${data.user.username}`);
        } else {
          toast.success(`Пользователь ${data.user.username} успешно заблокирован.`);
        }
      } else {
        toast.warn(`Предупреждение для ${data.user.username}: ${data.user.isWarn}/3`);
      }
    });
  };

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
      setOnlineUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isBanned: false, isWarn: 0 } : u))
      );
      setFilteredUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isBanned: false, isWarn: 0 } : u))
      );
    } catch (error) {
      console.error(error);
      toast.error('Ошибка разблокировки');
    }
  };
  useEffect(() => {
    socket.on("admin_result", ({ success, message, user }) => {
      toast[success ? "success" : "error"](message);
      if (success && user) {
        setSelectedModalUser((prev) => (prev?._id === user._id ? user : prev));
        setOnlineUsers((prev) =>
          prev.map((u) => (u._id === user._id ? user : u))
        );
        setFilteredUsers((prev) =>
          prev.map((u) => (u._id === user._id ? user : u))
        );
      }
    });

    return () => {
      socket.off("admin_result");
    };
  }, []);


  const handleBan = (userId, selectedId, reason) => {
    socket.emit("ban_user", { userId, selectedId, reason });

    socket.once("ban_result", (data) => {
      if (!data.success) {
        toast.error(data.message || "Ошибка при блокировке");
        return;
      }

      toast.success(`Пользователь ${data.user.username} успешно заблокирован.`);

      setSelectedModalUser((prev) =>
        prev && prev._id === data.user._id ? { ...prev, isBanned: true } : prev
      );

      setOnlineUsers((prev) =>
        prev.map((u) =>
          u._id === data.user._id ? { ...u, isBanned: true } : u
        )
      );

      setFilteredUsers((prev) =>
        prev.map((u) =>
          u._id === data.user._id ? { ...u, isBanned: true } : u
        )
      );

      if (data.user._id === user._id) {
        toast.error("Вы были заблокированы.");
        dispatch(logout());
        navigate('/login');
      }
    });
  };

  const makeAdmin = (userId, selectedId, role) => {
    if (!['owner', 'admin', 'moderator', 'user'].includes(role)) return;
    setIsChangingRole(true);
    socket.emit('make_admin', { userId, SelectedId: selectedId, role });
  };

  const handleMute = async (userID, selectedUser, reason) => {
    try {
      socket.emit("mute_admin", { userID, selectedUser, reason });

      socket.once("mute_beruvchi", (data) => {
        if (!data.success) {
          toast.error(data.message || "Mute berishda xatolik yuz berdi");
          return;
        }

        if (data.user.isMuted) {
          toast.success(`${data.user.username} muvaffaqiyatli mute qilindi.`);
        } else {
          toast.info(`${data.user.username} mute holatidan chiqarildi.`);
        }

        setSelectedModalUser((prev) =>
          prev?._id === data.user._id ? { ...prev, isMuted: data.user.isMuted } : prev
        );

        setOnlineUsers((prev) =>
          prev.map((u) =>
            u._id === data.user._id ? { ...u, isMuted: data.user.isMuted } : u
          )
        );

        setFilteredUsers((prev) =>
          prev.map((u) =>
            u._id === data.user._id ? { ...u, isMuted: data.user.isMuted } : u
          )
        );
      });
    } catch (e) {
      console.error("WEBSOCKET ERROR: ", e);
      toast.error("Mute berishda xatolik yuz berdi");
    }
  };

  useEffect(() => {
    if (onlineUsers.length > 0) {
      dispatch(setOnlineUsers(onlineUsers));
    }
  }, [onlineUsers, dispatch]);

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
      dispatch(setOnlineUsers(filtered));
      setLoading(false);
    };

    const handleAdminResult = (data) => {
      setIsChangingRole(false);
      if (!data.success) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);
      setOnlineUsers((prev) =>
        prev.map((u) => (u._id === data.user._id ? { ...u, role: data.user?.role } : u))
      );
      setFilteredUsers((prev) =>
        prev.map((u) => (u._id === data.user._id ? { ...u, role: data.user?.role } : u))
      );
      setSelectedModalUser((prev) => (prev ? { ...prev, role: data.user?.role } : prev));
    };

    socket.on('online_users', handleOnlineUsers);
    socket.on('admin_result', handleAdminResult);

    const handleBeforeUnload = () => {
      socket.emit('user_left', user);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      socket.emit('user_left', user);
      socket.off('online_users', handleOnlineUsers);
      socket.off('admin_result', handleAdminResult);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [user, dispatch]);

  useEffect(() => {
    if (user?._id) {
      socket.emit('check_warns', { userId: user._id });

      socket.on('warn_status', (data) => {
        if (data.isBanned) {
          socket.emit('user_left', user);
          dispatch(logout());
          navigate('/login');
        } else if (data.isWarn > 0) {
          toast.warn(`You have ${data.isWarn}/3 warnings`);
        }
      });

      return () => {
        socket.off('warn_status');
      };
    }
  }, [user, dispatch, navigate]);

  const sortedUsers = [...filteredUsers].sort((a, b) =>
    b.status ? 1 : a.status ? -1 : 0
  );

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
  const handleUnmute = () => {
    if (!selectedModalUser || !user) return;
    onMute(user._id, selectedModalUser._id, 'unmute');
  };
  const onMute = (fromID, toID, type) => {
    socket.emit(type === 'unmute' ? 'unmute_admin' : 'mute_admin', {
      userID: fromID,
      selectedUser: toID,
    });
  };


  return (
    <div className="flex-1 bg-base-300 overflow-y-auto p-2 h-screen flex-col  py-5">
      <h2 className="text-xl font-bold mb-4">Online Users</h2>
      <SearchBar onSearch={handleSearch} />
      <div className="flex items-center gap-1 justify-center flex-col w-full flex-1 cursor-pointer">
        {loading ? (
          <div className="flex justify-center items-center flex-1 h-8/10">
            <span className="loading loading-infinity loading-xl"></span>
          </div>
        ) : sortedUsers.length === 0 ? (
          <p className="text-gray-400">No users online yet</p>
        ) : (
          sortedUsers.map((u) => (
            <UserList
              key={u._id}
              user={u}
              currentUser={user}
              onOpenChat={handleOpenChat}
              onOpenModal={handleOpenModal}
            />
          ))
        )}
      </div>
      <UserProfileModal
        selectedModalUser={selectedModalUser}
        currentUser={user}
        onClose={() => document.getElementById('my_modal_1').close()}
        handleCopy={handleCopy}
        onBan={handleBan}
        onKick={handleKick}
        onMute={handleMute}
        onUnmute={handleUnmute}
        onWarn={handleWarn}
        onUnban={handleUnban}
        onMakeAdmin={makeAdmin}
        isChangingRole={isChangingRole}
        copied={copied}
        setCopied={setCopied}
      />
    </div>
  );
};

export default Sidebar;