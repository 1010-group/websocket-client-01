// ./Sidebar/Sidebar.jsx
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import socket from '../socket';
import { logout } from '../redux/slices/authSlice';
import { setOnlineUsers } from '../redux/slices/onlineUsers';
import { setSelectedUser } from '../redux/slices/selectedUser';
import SearchBar from './SidebarComponents/SearchBar';
import UserList from './SidebarComponents/UserList';
import UserProfileModal from './SidebarComponents/UserProfileModal';

const Sidebar = () => {
  const user = useSelector((state) => state.auth.user);
  const onlineUsers = useSelector((state) => state.onlineUsers.onlineUsers);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { chatId } = useParams();

  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedModalUser, setSelectedModalUser] = useState(null);
  const [isChangingRole, setIsChangingRole] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSearch = (term) => {
    if (!term) return setFilteredUsers(onlineUsers);
    setFilteredUsers(
      onlineUsers.filter((u) => u.username.toLowerCase().includes(term.toLowerCase()))
    );
  };

  const handleOpenChat = (u) => {
    dispatch(setSelectedUser(u));
    setTimeout(() => navigate(`/chat/${u._id}`), 100);
  };

  const handleOpenModal = (u) => {
    setSelectedModalUser(u);
    document.getElementById('my_modal_1')?.showModal();
  };

  const handleCopy = async (phone) => {
    try {
      await navigator.clipboard.writeText(phone);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Копирование не удалось');
    }
  };

  const handleWarn = (userId) => {
    socket.emit('warn_user', { userId });
  };

  const handleUnban = async (userId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/unban/${userId}`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) return toast.error(data.message || 'Ошибка разблокировки');
      toast.success('Разблокирован');
      updateUserList({ ...data.user, isBanned: false, isWarn: 0 });
    } catch {
      toast.error('Серверная ошибка');
    }
  };

  const handleBan = (from, to, reason) => {
    socket.emit('ban_user', { userId: from, selectedId: to, reason });
  };

  const handleKick = (from, to) => {
    socket.emit('kick_user', { userId: from, selectedId: to });
  };

  const makeAdmin = (from, to, role) => {
    if (!['owner', 'admin', 'moderator', 'user'].includes(role)) return;
    setIsChangingRole(true);
    socket.emit('make_admin', { userId: from, SelectedId: to, role });
  };

  const handleMute = (from, to) => {
    socket.emit('mute_admin', { userID: from, selectedUser: to });
  };

  const handleUnmute = () => {
    if (!user || !selectedModalUser) return;
    socket.emit('unmute_admin', { userID: user._id, selectedUser: selectedModalUser._id });
  };

  const handleDelete = (userId) => {
    socket.emit('delete_user', userId);
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
    if (user) {
      socket.emit('user_joined', user);

      const unloadHandler = () => socket.emit('user_left', user);
      window.addEventListener('beforeunload', unloadHandler);
      return () => {
        window.removeEventListener('beforeunload', unloadHandler);
        socket.emit('user_left', user);
      };
    }
  }, [user]);

  useEffect(() => {
    const handleOnlineUsers = (users) => {
      const filtered = users.filter((u) => u._id !== user?._id);
      dispatch(setOnlineUsers(filtered));
      setFilteredUsers(filtered);
      setLoading(false);
    };

    const handleWarnResult = ({ success, message, user: updatedUser }) => {
      if (!success) return toast.error(message);
      updateUserList(updatedUser);
      toast[updatedUser.isBanned ? 'error' : 'warn'](
        updatedUser.isBanned
          ? `Вы были заблокированы`
          : `Предупреждение: ${updatedUser.isWarn}/3`
      );
    };

    const handleKickResult = ({ message }) => {
      toast.error(message || 'Siz kick qilindingiz');
      dispatch(logout());
      navigate('/login');
    };

    const handleAdminResult = (data) => {
      setIsChangingRole(false);
      if (!data.success) return toast.error(data.message);
      updateUserList(data.user);
      toast.success(data.message);
    };

    socket.on('online_users', handleOnlineUsers);
    socket.on('warn_result', handleWarnResult);
    socket.on('kick_user', handleKickResult);
    socket.on('admin_result', handleAdminResult);

    return () => {
      socket.off('online_users', handleOnlineUsers);
      socket.off('warn_result', handleWarnResult);
      socket.off('kick_user', handleKickResult);
      socket.off('admin_result', handleAdminResult);
    };
  }, [dispatch, navigate]);

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
      return () => socket.off('warn_status');
    }
  }, [user, dispatch, navigate]);

  const sortedUsers = [...filteredUsers].sort((a, b) => (b.status ? 1 : a.status ? -1 : 0));

  return (
    <div className={`flex-1 bg-base-300 overflow-y-auto p-2 h-screen flex-col py-5 ${chatId ? 'hidden md:block' : ''}`}>
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
              loading={loading}
              onOpenModal={handleOpenModal}
            />
          ))
        )}
      </div>

      <UserProfileModal
        selectedModalUser={selectedModalUser}
        currentUser={user}
        onClose={() => document.getElementById('my_modal_1')?.close()}
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
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default Sidebar;
