import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SearchBar from './SidebarComponents/SearchBar';
import UserListRenderer from './SidebarComponents/UserListRenderer';
import UserProfileModal from './SidebarComponents/UserProfileModal';
import useSidebarLogic from './SidebarComponents/useSidebarLogic';
import socket from '../socket';

const Sidebar = () => {
  const { chatId } = useParams();
  const {
    filteredUsers,
    loading,
    selectedModalUser,
    currentUser,
    copied,
    isChangingRole,
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
    handleDelete,
  } = useSidebarLogic();

  useEffect(() => {
    if (!currentUser?._id) return;

    socket.emit('user_joined', {
      _id: currentUser._id,
      username: currentUser.username,
      fullName: currentUser.fullName,
      phone: currentUser.phone,
      image: currentUser.image,
      description: currentUser.description,
      birthDate: currentUser.birthDate,
    });

    const handleBeforeUnload = () => {
      socket.emit('user_left', currentUser);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      socket.emit('user_left', currentUser);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [currentUser]);

  return (
    <div className={`w-full bg-gradient-to-b from-[#0F172A] via-[#0D1B30] to-[#0F172A] border-r border-slate-800 flex flex-col h-screen ${chatId ? 'hidden md:flex' : 'flex'}`}>
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3 mb-2">
          <div className=" rounded-xl">
            <img src="/public/logo.png" className='size-16' alt="" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Online Users</h2>
            <p className="text-sm text-slate-400">
              {filteredUsers.filter(u => u.status).length} of {filteredUsers.length} online
            </p>
          </div>
        </div>

        <SearchBar onSearch={handleSearch} />
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto  py-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
        <UserListRenderer
          loading={loading}
          users={filteredUsers}
          currentUser={currentUser}
          onOpenChat={handleOpenChat}
          onOpenModal={handleOpenModal}
        />
      </div>

      <UserProfileModal
        selectedModalUser={selectedModalUser}
        currentUser={currentUser}
        onClose={() => document.getElementById('my_modal_1')?.close()}
        handleCopy={handleCopy}
        copied={copied}
        onBan={handleBan}
        onKick={handleKick}
        onMute={handleMute}
        onUnmute={handleUnmute}
        onWarn={handleWarn}
        onUnban={handleUnban}
        onMakeAdmin={makeAdmin}
        isChangingRole={isChangingRole}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default Sidebar;