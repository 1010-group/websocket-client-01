// ./Sidebar/UserListRenderer.jsx
import React from 'react';
import UserList from '../SidebarComponents/UserList';

const UserListRenderer = ({ loading, users, currentUser, onOpenChat, onOpenModal }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80%]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (users.length === 0) {
    return <p className="text-center text-gray-400 italic mt-4">No users online yet</p>;
  }

  return (
    <div className="space-y-3 px-3 py-2 overflow-y-auto max-h-full">
      {users.map((u, idx) => (
        <UserList
          key={u._id}
          index={idx + 1}
          user={u}
          currentUser={currentUser}
          onOpenChat={onOpenChat}
          onOpenModal={onOpenModal}
        />
      ))}
    </div>
  );
};

export default UserListRenderer;
