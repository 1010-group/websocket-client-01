import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSelectedUser } from '../redux/slices/selectedUser';
import socket from '../socket';
import { FaPhoneSquareAlt } from 'react-icons/fa';
import { BsFillCalendarDateFill } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { MdOutlineDriveFileRenameOutline } from 'react-icons/md';
import { logout } from '../redux/slices/authSlice';
import UserProfileModal from './SidebarComponents/UserProfileModal';

const Sidebar = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedModalUser, setSelectedModalUser] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isChangingRole, setIsChangingRole] = useState(false);


  const handleMute = async (userId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/mute/${userId}`, {
        method: 'PUT',
        credentials: 'include',
      });
      const data = await res.json();
      toast.success(data.message);
      // Обнови selectedModalUser при необходимости
    } catch (err) {
      toast.error('Failed to mute user');
    }
  };

  const handleUnmute = async (userId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/unmute/${userId}`, {
        method: 'PUT',
        credentials: 'include',
      });
      const data = await res.json();
      toast.success(data.message);
    } catch (err) {
      toast.error('Failed to unmute user');
    }
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
    console.log('Opening modal for user:', malumot); // Debug log
    setSelectedModalUser(malumot);
    const modal = document.getElementById('my_modal_1');
    if (modal) {
      modal.showModal();
    } else {
      console.error('Modal with ID my_modal_1 not found');
    }
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

  const handleBan = (SelectedId) => {
    const reason = 'Нарушение правил'; // Default reason; can be enhanced with user input
    socket.emit('ban_user', { userId: user._id, SelectedId, reason });
    console.log("BAN_USER: ", { userId: user._id, SelectedId, reason })
    socket.once('ban_result', (data) => {
      if (!data.success) {
        toast.error(data.message);
        return;
      }

      if (data.success) {
        toast.success(data.message)
      }

      setSelectedModalUser(data.user);
      setOnlineUsers((prev) =>
        prev.map((u) => (u._id === data.user._id ? { ...u, isBanned: data.user.isBanned, isWarn: data.user.isWarn } : u))
      );
      setFilteredUsers((prev) =>
        prev.map((u) => (u._id === data.user._id ? { ...u, isBanned: data.user.isBanned, isWarn: data.user.isWarn } : u))
      );

    });
    socket.once("personal_message", (data) => {
      if (data?.type === "warning") {
        toast.warn(data.message);
        dispatch(logout())
      }
    })
  };

  const makeAdmin = (userId, selectedId, role) => {
    if (!['admin', 'moderator', 'user'].includes(role)) return;
    setIsChangingRole(true);
    socket.emit('make_admin', { userId, SelectedId: selectedId, role });
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

    const handleAdminResult = (data) => {
      setIsChangingRole(false);
      if (!data.success) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);
      setOnlineUsers((prev) =>
        prev.map((u) => (u._id === data.user._id ? { ...u, role: data.user.role } : u))
      );
      setFilteredUsers((prev) =>
        prev.map((u) => (u._id === data.user._id ? { ...u, role: data.user.role } : u))
      );
      setSelectedModalUser((prev) => (prev ? { ...prev, role: data.user.role } : prev));
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
  }, [user]);

  useEffect(() => {
    if (user?._id) {
      socket.emit('check_warns', { userId: user._id });

      socket.on('warn_status', (data) => {
        if (data.isBanned) {
          // toast.error('Your account is banned');
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

  return (
    <div className="w-3/12 bg-base-300 overflow-y-auto p-2 h-screen flex-col flex py-5">
      <h2 className="text-xl font-bold mb-4">Online Users</h2>
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
     
      {selectedModalUser && (
        <UserProfileModal
          user={user}
          selectedModalUser={selectedModalUser}
          handleCopy={handleCopy}
          copied={copied}
          handleBan={handleBan}
          handleWarn={handleWarn}
          handleUnban={handleUnban}
          makeAdmin={makeAdmin}
          isChangingRole={isChangingRole}
          handleMute={handleMute}
          handleUnmute={handleUnmute}
        />
      )}
    </div>
  );
};

export default Sidebar; 