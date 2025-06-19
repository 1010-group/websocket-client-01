import React from 'react';
import { IoSettingsSharp } from 'react-icons/io5';
import { FaPhoneSquareAlt } from 'react-icons/fa';
import { BsFillCalendarDateFill } from 'react-icons/bs';
import { MdLogout, MdOutlineDriveFileRenameOutline } from 'react-icons/md';
import Battery from './Battery';

const NavbarDrawer = ({ user, handleCopy, handleCopyName, copied, handleLogout }) => {
  return (
    <div className="drawer">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <label
          htmlFor="my-drawer"
          className="btn shadow-md transition duration-300 drawer-button"
        >
          <IoSettingsSharp size={24} />
        </label>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="backdrop-blur-md w-80 shadow-2xl shadow-primary text-base-content flex flex-col justify-between min-h-full p-6 space-y-6 rounded-lg">
          <div className="flex flex-col gap-6">
            <div className="flex gap-4 flex-col">
              <div className="flex justify-between">
                <img
                  className="w-14 h-14 rounded-full border-2 border-primary shadow-md"
                  src={
                    user?.image ||
                    "https://static.vecteezy.com/system/resources/thumbnails/028/149/256/small_2x/3d-user-profile-icon-png.png"
                  }
                  alt={user?.username}
                />
                <div className="flex items-center justify-center gap-2 cursor-pointer" onClick={() => handleCopyName(user?.fullName)}>
                  <span className="text-secondary font-semibold">
                    <span className="text-2xl mr-0.5">@</span>{user?.fullName || "No full name provided"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-primary">
                  <Battery />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <MdOutlineDriveFileRenameOutline className="text-primary text-2xl" />
                  <p className="font-bold text-lg text-primary">{user?.username}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div aria-label="success" className="status status-success"></div>
                  <p className="text-success font-semibold">Online</p>
                </div>
                <div className="flex items-center gap-2 group duration-300">
                  <div
                    className="hidden group-hover:flex items-center gap-2 cursor-pointer duration-300"
                    onClick={() => handleCopy(user?.phone)}
                  >
                    <div className="text-success font-bold duration-300">
                      {copied ? "Copied!" : "Copy"}
                    </div>
                  </div>
                  <FaPhoneSquareAlt className="text-success text-2xl" />
                  <a href={`tel:${user?.phone}`} className="text-success">
                    {user?.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <BsFillCalendarDateFill className="inline-block text-secondary text-2xl" />
                  <p className="text-secondary">
                    {user?.birthDate
                      ? new Date(user.birthDate).toLocaleDateString("en-CA")
                      : "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <button
              className="btn btn-error w-full flex items-center gap-3 justify-center font-bold shadow-md rounded-lg transition duration-300"
              onClick={() => document.getElementById("my_modal_2").showModal()}
            >
              <span>Log out</span>
              <MdLogout size={20} />
            </button>
            <dialog id="my_modal_2" className="modal">
              <div className="modal-box bg-base-100 border border-error rounded-lg shadow-md text-error">
                <h3 className="font-bold text-lg text-center mb-4">Log out of account</h3>
                <p className="text-center py-6">Are you sure you want to log out?</p>
                <div className="flex justify-center gap-6">
                  <button
                    className="btn btn-error text-base-100 font-bold shadow-md min-w-[140px]"
                    onClick={handleLogout}
                  >
                    Yes
                  </button>
                  <button
                    className="btn text-base-100 font-bold shadow-md min-w-[140px]"
                    onClick={() => document.getElementById("my_modal_2").close()}
                  >
                    Cancel
                  </button>
                </div>
              </div>
              <form method="dialog" className="modal-backdrop">
                <button>close</button>
              </form>
            </dialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavbarDrawer;