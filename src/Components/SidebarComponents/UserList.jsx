// ./SidebarComponents/UserList.jsx
import React from 'react';

const frameStyles = {
  gold: "ring-2 ring-yellow-400",
  neon: "ring-2 ring-cyan-400 shadow-cyan-400 shadow-sm",
  red: "ring-2 ring-red-500",
  rainbow: "ring-[3px] ring-offset-2 ring-gradient-to-r from-red-500 via-yellow-400 to-blue-500",
};

const roleColors = {
  owner: "bg-red-600 text-white",
  admin: "bg-blue-600 text-white",
  moderator: "bg-yellow-400 text-black",
  muted: "bg-orange-500 text-white",
  banned: "bg-gray-500 text-white line-through",
};

const UserList = ({ index, user, currentUser, onOpenChat, onOpenModal }) => {
  const avatarFrame = frameStyles[user?.avatarFrame] || "";

  return (
    <div
      className={`flex items-center justify-between transition rounded-xl px-3 py-2 shadow-sm cursor-pointer 
  ${user.role === 'owner' ? 'border-2 border-error' : 'border border-base-300'} 
  ${user.status ? 'bg-base-200 hover:bg-base-100' : 'bg-base-300 hover:bg-base-200'}`}

      onClick={() => onOpenChat(user)}
    >
      {/* Left side: avatar + info */}
      <div className="flex items-center gap-3">
        {/* Index or badge */}
        <div className="text-sm font-semibold text-gray-300 w-5 text-center">{index}</div>

        <div className="relative">
          <button onClick={(e) => { e.stopPropagation(); onOpenModal(user); }}>
            <img
              src={user.image || '/default-avatar.jpg'}
              alt={user.username}
              className={`size-10 rounded-full object-cover ${avatarFrame}`}
            />
          </button>

          {user.status && (
            <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-green-500 border-2 border-[#1E2A3A]"></span>
          )}
        </div>

        <div>
          <p className="text-white font-semibold text-sm truncate w-[100px]">{user.username}</p>
          <p className={`text-xs ${user.status ? 'text-green-400' : 'text-gray-400'}`}>
            {user.status ? 'Online' : 'Offline'}
          </p>
        </div>
      </div>

      {/* Right side: role/status badges */}
      <div className="flex flex-col gap-1 items-end text-xs">
        {user.isBanned ? (
          <span className="bg-gray-600 text-white text-xs px-2 py-0.5 rounded-full">Banned</span>
        ) : (
          <>
            {user.isMuted && (
              <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">Muted</span>
            )}
            {user.role !== "user" && (
              <span className={`${roleColors[user.role]} px-2 py-0.5 rounded-full`}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserList;
