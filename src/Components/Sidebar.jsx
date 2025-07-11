import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SidebarComponents/SearchBar';
import UserProfileModal from './SidebarComponents/UserProfileModal';
import UserListRenderer from './SidebarComponents/UserListRenderer';
import useSidebarLogic from './SidebarComponents/useSidebarLogic';

const Sidebar = () => {
  const {
    filteredUsers, loading, selectedModalUser, copied,
    handleSearch, handleOpenChat, handleOpenModal,
    handleBan, handleKick, handleMute, handleUnmute,
    handleWarn, handleUnban, makeAdmin, handleCopy,
    currentUser, isChangingRole
  } = useSidebarLogic();

  return (
    <div className="flex-1 bg-base-300 overflow-y-auto p-2 h-screen flex-col py-5">
      <h2 className="text-xl font-bold mb-4">Online Users</h2>
      <SearchBar onSearch={handleSearch} />

      <UserListRenderer
        loading={loading}
        users={filteredUsers}
        currentUser={currentUser}
        onOpenChat={handleOpenChat}
        onOpenModal={handleOpenModal}
      />

      <UserProfileModal
        selectedModalUser={selectedModalUser}
        currentUser={currentUser}
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
        setCopied={() => {}}
      />
    </div>
  );
};

export default Sidebar;
