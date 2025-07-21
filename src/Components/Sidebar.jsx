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

  // ⚙️ WebSocket: user_joined & user_left faqat 1 marta ishlashi kerak
  useEffect(() => {
    if (!currentUser?._id) return;

    // 👉 Tarmoqga qo‘shildi
    socket.emit('user_joined', {
      _id: currentUser._id,
      username: currentUser.username,
      fullName: currentUser.fullName,
      phone: currentUser.phone,
      image: currentUser.image,
      description: currentUser.description,
      birthDate: currentUser.birthDate,
    });

    // 👉 Sahifani yopayotgan bo‘lsa
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
    <div className={`flex-1 bg-base-300 overflow-y-auto p-2 h-screen flex-col py-5 ${chatId ? 'hidden md:block' : ''}`}>
      <h2 className="text-xl font-bold mb-4">Online Users</h2>

      <SearchBar onSearch={handleSearch} />

      <div className="flex items-center gap-1 justify-center flex-col w-full flex-1 cursor-pointer">
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
