import { IoMdNotifications } from "react-icons/io";

const NotificationBell = ({ unreadCount, notifications, markAsRead }) => (
  <div className="dropdown dropdown-end">
    {/* Bell button */}
    <div
      tabIndex={0}
      role="button"
      className="btn relative bg-base-100 border border-primary hover:bg-primary/10 shadow-md w-12 h-12 rounded-full flex items-center justify-center"
    >
      <IoMdNotifications className="text-2xl text-primary" />
      {unreadCount > 0 && (
        <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-error text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center animate-ping-once z-10">
          {unreadCount}
        </span>
      )}
    </div>

    {/* Dropdown menu */}
    <ul
      tabIndex={0}
      className="dropdown-content menu bg-base-100 rounded-xl shadow-lg w-72 sm:w-80 max-h-96 overflow-y-auto z-[100] p-2"
    >
      {notifications.length === 0 ? (
        <li>
          <p className="text-center text-sm text-gray-400 py-4">No notifications</p>
        </li>
      ) : (
        notifications.map((notif) => (
          <li
            key={notif._id}
            className={`p-3 rounded-lg mb-2 transition-all ${
              notif.read ? "bg-base-200" : "bg-primary/10"
            } hover:bg-primary/20 cursor-pointer`}
            onClick={() => !notif.read && markAsRead(notif._id)}
          >
            <div className="flex items-center gap-3">
              <img
                className="w-10 h-10 rounded-full border border-primary object-cover"
                src={
                  notif.fromUser?.image ||
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScdIYuCdg369Zi9PDQqmDljt26Co3bVUf4wA&s"
                }
                alt={notif.fromUser?.username || "System"}
              />
              <div className="flex-1">
                <p className="font-medium text-sm text-base-content">
                  {notif.fromUser?.username || "System"}
                </p>
                <p className="text-xs text-base-content/80 line-clamp-2">
                  {notif.message}
                </p>
                <p className="text-[10px] text-base-content/50 mt-1">
                  {new Date(notif.timestamp).toLocaleString()}
                </p>
              </div>
              {!notif.read && (
                <span className="h-2 w-2 rounded-full bg-blue-500 ml-2"></span>
              )}
            </div>
          </li>
        ))    
      )}
    </ul>
  </div>
);

export default NotificationBell;
