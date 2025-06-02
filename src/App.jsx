{/* Drawer (yon panel) */}
<div className="fixed top-10 right-10 z-[999]">
  <div className="drawer drawer-end">
    <input id="my-drawer" type="checkbox" className="drawer-toggle" />
    <div className="drawer-content">
      <label htmlFor="my-drawer" className="btn btn-primary drawer-button">
        <MdMenu size={24} />
      </label>
    </div>
    <div className="drawer-side">
      <label htmlFor="my-drawer" className="drawer-overlay"></label>
      <div className="menu bg-base-200 text-base-content min-h-full w-80 p-6 flex flex-col justify-between">
        {/* Telegram profili blok */}
        <div className="flex items-center gap-4 mb-8">
          <img
            src={
              user?.profilePic ||
              "https://static.vecteezy.com/system/resources/thumbnails/028/149/256/small_2x/3d-user-profile-icon-png.png"
            }
            alt={user?.username || "User"}
            className="w-16 h-16 rounded-full"
          />
          <div>
            <p className="font-semibold text-lg">{user?.username || "User Name"}</p>
            <p className={`text-sm font-medium ${onlineUsers.some((u) => u._id === user?._id && u.status) ? "text-green-500" : "text-red-500"}`}>
              {onlineUsers.some((u) => u._id === user?._id && u.status) ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        {/* Sidebar Items */}
        <ul className="flex-grow space-y-2">
          <li>
            <a className="flex items-center gap-2">
              <FiSettings /> Settings
            </a>
          </li>
          <li>
            <a className="flex items-center gap-2">
              <FiUser /> Contacts
            </a>
          </li>
          <li>
            <a className="flex items-center gap-2">
              <FiPhone /> Calls
            </a>
          </li>
          <li>
            <a className="flex items-center gap-2">
              <FiBookmark /> Saved Messages
            </a>
          </li>
        </ul>
        {/* Night Mode Toggle */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
          <div className="flex items-center gap-2">
            <FaMoon />
            <span>Night Mode</span>
          </div>
          <input
            type="checkbox"
            className="toggle toggle-primary"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
        </div>
      </div>
    </div>
  </div>
</div>
