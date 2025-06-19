import React from 'react';

const NotificationItem = ({ notif, markAsRead, handleOpenModal }) => {
  const handleClick = () => {
    if (!notif.read) markAsRead(notif._id);
  };

  return (
    <li
      className={`p-2 border-b ${notif.read ? 'bg-base-200' : 'bg-base-100'} hover:bg-base-300 cursor-pointer`}
      onClick={handleClick}
    >
      <div className="flex items-center gap-2">
        <button onClick={(e) => { e.stopPropagation(); handleOpenModal(notif.fromUser); }}>
          <img
            className="w-8 h-8 rounded-full"
            src={notif.fromUser?.image || "https://static.vecteezy.com/system/resources/thumbnails/028/149/256/small_2x/3d-user-profile-icon-png.png"}
            alt={notif.fromUser?.username || "System"}
          />
        </button>
        <div>
          <p className="font-semibold">{notif.fromUser?.username || "System"}</p>
          <p className="text-sm">{notif.message}</p>
          <p className="text-xs text-base-content/50">
            {new Date(notif.timestamp).toLocaleString()}
          </p>
        </div>
        {!notif.read && (
          <span className="ml-auto bg-primary mt-2 w-2 rounded-full"></span>
        )}
      </div>
    </li>
  );
};

export default NotificationItem;
