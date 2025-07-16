// src/Components/NavbarBottom.jsx
import React from "react";
import { IoSettingsSharp, IoNotifications } from "react-icons/io5";
import { MdColorLens } from "react-icons/md";
import Calls from "./Calls";
import { useSelector } from "react-redux";

const NavbarBottom = () => {
  const selectedUser = useSelector((state) => state.selectChat.selectedUser);
  const currentUser = useSelector((state) => state.auth.user);

  return (
    <div className="fixed bottom-0 left-0 w-full bg-base-200 border-t border-base-300 z-50 flex justify-around items-center h-16 lg:hidden">
      <button onClick={() => document.getElementById("settings_drawer")?.showModal()}>
        <IoSettingsSharp size={24} />
      </button>
      <Calls selectedUser={selectedUser} currentUser={currentUser} />
      <button onClick={() => document.getElementById("notif_drawer")?.showModal()}>
        <IoNotifications size={24} />
      </button>
      <button onClick={() => document.getElementById("theme_modal")?.showModal()}>
        <MdColorLens size={24} />
      </button>
    </div>
  );
};

export default NavbarBottom;
