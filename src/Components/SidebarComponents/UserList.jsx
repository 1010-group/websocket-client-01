import React from 'react';

const UserList = ({ user, currentUser, onOpenChat, onOpenModal }) => {
  const frameStyles = {
    gold: "ring-2 ring-yellow-400",
    neon: "ring-2 ring-cyan-400 shadow-cyan-400 shadow-md",
    red: "ring-2 ring-red-500",
    rainbow: "ring-[3px] ring-offset-2 ring-offset-base-100 ring-gradient-to-r from-red-500 via-green-400 to-blue-500",
  };

  const avatarFrame = frameStyles[user?.avatarFrame] || ""; // default: no frame

  return (
    <div
      className={`${user?.role === 'owner' ? 'shadow-md shadow-error animate-pulse' : ''} max-w-[90%] mx-auto relative flex items-center flex-1 w-full gap-3 p-2 mb-2 bg-base-200 rounded cursor-pointer hover:bg-base-100 transition`}
      onClick={() => onOpenChat(user)}
    >
      <button onClick={(e) => { e.stopPropagation(); onOpenModal(user); }}>
        <img
          className={`size-10 bg-base-300 p-1 rounded-full object-cover ${avatarFrame}`}
          src={user.image || 'https://encrypted-tbn0.gstatic.com/images?q=tbnp://example.com/default-image.jpg'}
          alt={user.username}
        />
      </button>

      <div>
        <p className={`${user?.role === 'owner' ? 'text-error text-shadow-md text-shadow-error' : 'font-medium'} font-medium text-sm`}>
          {user.username}
        </p>
        <p className={user.status ? 'text-success text-xs' : 'text-error text-xs'}>
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
  );
};

export default UserList;
