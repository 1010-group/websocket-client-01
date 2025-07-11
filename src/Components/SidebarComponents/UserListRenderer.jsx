// ./Sidebar/UserListRenderer.jsx
import React from 'react';
import UserList from '../SidebarComponents/UserList';

const UserListRenderer = ({ loading, users, currentUser, onOpenChat, onOpenModal }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center flex-1 h-8/10">
        <span className="loading loading-infinity loading-xl"></span>
      </div>
    );
  }

  if (users.length === 0) {
    return <p className="text-gray-400">No users online yet</p>;
  }

  return users.map((u) => (
    <UserList
      key={u._id}
      user={u}
      currentUser={currentUser}
      onOpenChat={onOpenChat}
      onOpenModal={onOpenModal}
    />
  ));
};

export default UserListRenderer;
