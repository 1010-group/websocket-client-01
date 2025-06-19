import React from 'react';
import { IoNotifications } from 'react-icons/io5';
import NotificationItem from './NotificationItem';

const NotificationDropdown = ({
  notifications,
  unreadCount,
  markAsRead,
  clearAllNotifications,
  handleOpenModal,
}) => {
  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn m-1 w-20 h-10 relative">
        <IoNotifications size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 badge badge-error text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-100 rounded-box z-1 w-80 p-2 shadow-md shadow-primary max-h-96 overflow-y-auto"
      >
        {notifications.length === 0 ? (
          <li>
            <p className="text-base-content/50">No notifications</p>
          </li>
        ) : (
          <>
            {notifications.map((notif) => (
              <NotificationItem
                key={notif._id}
                notif={notif}
                markAsRead={markAsRead}
                handleOpenModal={handleOpenModal}
              />
            ))}
            <li>
              <button
                className="text-white btn btn-error btn-sm w-full"
                onClick={clearAllNotifications}
              >
                Clear all
              </button>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default NotificationDropdown;
