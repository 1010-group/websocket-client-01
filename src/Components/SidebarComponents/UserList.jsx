// src/Components/SidebarComponents/UserList.jsx
import React from 'react';

const UserList = ({ user, currentUser, onOpenChat, onOpenModal, loading }) => {
  return (
    loading ? (
      <div className="flex justify-center items-center flex-1 h-8/10">
        <span className="loading loading-infinity loading-xl"></span>
      </div>
    )
      :
      (
        <div
          className={`${user?.role === 'owner' ? 'shadow-md shadow-error animate-pulse' : ''} max-w-[90%] mx-auto relative flex items-center flex-1 w-full gap-3 p-2 mb-2 bg-base-200 rounded cursor-pointer hover:bg-base-100 transition`}
          onClick={() => onOpenChat(user)}
        >
          <button onClick={(e) => { e.stopPropagation(); onOpenModal(user); }}>
            <img
              className="w-12 h-12 rounded-full"
              src={user.image || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScdIYuCdg369Zi9PDQqmDljt26Co3bVUf4wA&s'}
              alt=""
            />
          </button>
          <div>
            <p className={`${user?.role === 'owner' ? 'text-error' : ''} font-semibold ${user?.role === 'owner' ? 'text-shadow-md text-shadow-error' : ''}`}>
              {user.username}
            </p>
            <p className={user.status ? 'text-success' : 'text-error'}>
              {user.status ? 'Online' : 'Offline'}
            </p>
          </div>
          <div className="flex-1 text-end text-xs">
            <div className="flex items-center gap-2 flex-1 justify-end relative">
              {user.isBanned ? (
                <span className="text-red-500 font-bold text-shadow-md text-shadow-error">Banned</span>
              ) : user?.role === 'owner' ? (
                <>
                  <span className="text-error/75 text-shadow-md text-shadow-error">Owner</span>
                  <img
                    src="https://img.pikbest.com/origin/09/26/93/60DpIkbEsTGF9.png!sw800"
                    className="size-12 absolute -top-10 -right-7"
                    alt=""
                  />
                </>
              ) : user?.role === 'admin' ? (
                <span className="text-info/75 text-shadow-md text-shadow-info">Admin</span>
              ) : user?.role === 'moderator' ? (
                <span className="text-warning/75 text-shadow-md text-shadow-warning">Moderator</span>
              ) : null}
            </div>
          </div>
        </div>
      )
  );
};

export default UserList;