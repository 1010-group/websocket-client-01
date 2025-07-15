import { IoMdNotifications } from "react-icons/io";


const NotificationBell = ({ unreadCount, notifications, markAsRead }) => (
  <div className="dropdown dropdown-end ">
    <div tabIndex={0} role="button" className="btn m-1 w-20 h-10 relative">
      <IoMdNotifications  size={24} />
      {unreadCount > 0 && (
        <span className="absolute top-0 right-0 bg-error text-accent-content text-xs rounded-full h-5 w-5 flex items-center justify-center  duration-300">
          {unreadCount}
        </span>
      )}
    </div>
    
    <ul
      tabIndex={0}
      className="dropdown-content menu flex items-center justify-center  bg-base-100 rounded-box z-1 xl:w-80 xl:h-60 md:w-40 md:h-40 sm:w-50 sm:h-50 py-2  shadow-md shadow-primary max-h-96 overflow-y-auto"
    >
      
      {notifications.length === 0 ? (
        <li><p className="text-gray-400">No notifications</p></li>
      ) : (
        notifications.map((notif) => (
          <li
            key={notif._id}
            className={`p-2 border-b ${notif.read ? 'bg-base-200' : 'bg-base-100'} hover:bg-base-300 cursor-pointer transition duration-200`}
            onClick={() => !notif.read && markAsRead(notif._id)}
          >
            <div className="flex items-center gap-2">
              <img
                className="w-10 h-10 rounded-full border border-primary "
                src={notif.fromUser?.image || "https://static.vecteezy.com/system/resources/thumbnails/028/149/256/small_2x/3d-user-profile-icon-png.png"}
                alt={notif.fromUser?.username || "System"}
              />
              <div>
                <p className="font-semibold md:text-sm text-2xl">{notif.fromUser?.username || "System"}</p>
                <p className="md:text-xs textsm">{notif.message}</p>
                <p className="text-xs text-gray-400">
                  {new Date(notif.timestamp).toLocaleString()}
                </p>
              </div>
              {!notif.read && (
                <span className="ml-auto bg-blue-500 h-2 w-2 rounded-full"></span>
              )}
            </div>
          </li>
        ))
      )}
      
    </ul>
  </div>
);

export default NotificationBell;
