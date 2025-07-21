// ./Sidebar/hooks/useSidebarLogic.js
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser } from '../../redux/slices/selectedUser';
import { logout } from '../../redux/slices/authSlice';
import { setOnlineUsers } from '../../redux/slices/onlineUsers';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import socket from '../../socket';

const useSidebarLogic = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.user);
  const onlineUsers = useSelector((state) => state.onlineUsers.onlineUsers);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedModalUser, setSelectedModalUser] = useState(null);
  const [isChangingRole, setIsChangingRole] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSearch = (term) => {
    const filtered = !term
      ? onlineUsers
      : onlineUsers.filter((u) => u.username.toLowerCase().includes(term.toLowerCase()));
    setFilteredUsers(filtered);
  };

  const handleOpenChat = (u) => {
    if (u._id === currentUser._id) navigate('/favorites');
    else {
      dispatch(setSelectedUser(u));
      navigate('/chat/' + u._id);
    }
  };

  const handleOpenModal = (u) => {
    setSelectedModalUser(u);
    document.getElementById('my_modal_1').showModal();
  };

  const handleKick = (from, to) => {
    socket.emit('kick_user', { userId: from, selectedId: to });
    socket.once('kick_result', (data) => {
      toast[data.success ? 'success' : 'error'](data.message);
      if (data.success && to === currentUser._id) {
        dispatch(logout());
        navigate('/login');
      }
    });
  };

  const handleWarn = (id) => {
    socket.emit('warn_user', { userId: id });
    socket.once('warn_result', (data) => {
      if (!data.success) return toast.error(data.message);
      setSelectedModalUser(data.user);
      updateUserList(data.user);
      toast[data.user.isBanned ? 'error' : 'warn'](
        data.user.isBanned
          ? `Вы были заблокированы`
          : `Предупреждение: ${data.user.isWarn}/3`
      );
    });
  };

  const handleUnban = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/unban/${id}`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) return toast.error(data.message || 'Ошибка разблокировки');
      toast.success('Разблокирован');
      updateUserList({ ...data.user, isBanned: false, isWarn: 0 });
    } catch (err) {
      toast.error('Серверная ошибка');
    }
  };

  const handleBan = (from, to, reason) => {
    socket.emit('ban_user', { userId: from, selectedId: to, reason });
    socket.once('ban_result', (data) => {
      if (!data.success) return toast.error(data.message);
      updateUserList({ ...data.user, isBanned: true });
      if (data.user._id === currentUser._id) {
        dispatch(logout());
        navigate('/login');
      }
    });
  };

  const makeAdmin = (from, to, role) => {
    if (!['owner', 'admin', 'moderator', 'user'].includes(role)) return;
    setIsChangingRole(true);
    socket.emit('make_admin', { userId: from, SelectedId: to, role });
  };

  const handleMute = (from, to) => {
    socket.emit('mute_admin', { userID: from, selectedUser: to });
    socket.once('mute_beruvchi', (data) => {
      if (!data.success) return toast.error(data.message);
      toast[data.user.isMuted ? 'success' : 'info'](
        `${data.user.username} ${data.user.isMuted ? 'mute qilindi' : 'mute chiqarildi'}`
      );
      updateUserList(data.user);
    });
  };

  const handleUnmute = () => {
    if (!selectedModalUser || !currentUser) return;
    socket.emit('unmute_admin', {
      userID: currentUser._id,
      selectedUser: selectedModalUser._id,
    });
  };

  const handleCopy = async (phone) => {
    try {
      await navigator.clipboard.writeText(phone);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      toast.error('Копирование не удалось');
    }
  };

  const updateUserList = (updatedUser) => {
    dispatch(setOnlineUsers((prev) =>
      prev.map((u) => (u._id === updatedUser._id ? updatedUser : u))
    ));
    setFilteredUsers((prev) =>
      prev.map((u) => (u._id === updatedUser._id ? updatedUser : u))
    );
    setSelectedModalUser((prev) =>
      prev?._id === updatedUser._id ? updatedUser : prev
    );
  };

  useEffect(() => {
    const handleOnlineUsers = (users) => {
      console.log("USERS: ", users)
      dispatch(setOnlineUsers(users));
    };

    socket.on("online_users", handleOnlineUsers);

    return () => {
      socket.off("online_users", handleOnlineUsers);
    };
  }, [dispatch]);

  useEffect(() => {
    if (onlineUsers.length) {
      setFilteredUsers(onlineUsers);
      setLoading(false);
    }
  }, [onlineUsers]);

  return {
    filteredUsers,
    loading,
    selectedModalUser,
    copied,
    handleSearch,
    handleOpenChat,
    handleOpenModal,
    handleBan,
    handleKick,
    handleMute,
    handleUnmute,
    handleWarn,
    handleUnban,
    makeAdmin,
    handleCopy,
    currentUser,
    isChangingRole
  };
};

export default useSidebarLogic;
