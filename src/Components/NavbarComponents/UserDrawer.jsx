import { IoSettingsSharp } from "react-icons/io5";
import { MdOutlineDriveFileRenameOutline, MdLogout } from "react-icons/md";
import { BsFillCalendarDateFill } from "react-icons/bs";
import { FaPhoneSquareAlt } from "react-icons/fa";
import NotificationBell from "./NotificationBell";

const UserDrawer = ({ user, handleLogout, handleCopy, copied }) => (
  <div className="drawer">
    <input id="my-drawer" type="checkbox" className="drawer-toggle" />
    <div className="drawer-content">
      <label
        htmlFor="my-drawer"
        className="btn w-12 h-12 min-h-0 p-0 rounded-full bg-base-100 border border-primary shadow-md hover:bg-primary/10 flex items-center justify-center drawer-button"

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
      <div className="backdrop-blur-md w-full sm:w-80 shadow-2xl shadow-cyan-500 text-neonCyan flex flex-col justify-between min-h-full p-6 space-y-6 shadow-neon-cyan rounded-lg">
        <div className="flex flex-col gap-6">
          <div className="flex gap-4 flex-col">
            <img
              className="w-14 h-14 rounded-full border-2 border-cyan-600 shadow-cyan-600 shadow-2xl"
              src={
                user?.image ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScdIYuCdg369Zi9PDQqmDljt26Co3bVUf4wA&s"
              }
              alt={user?.username}
            />
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <MdOutlineDriveFileRenameOutline className="text-primary text-2xl" />
                <p className="font-bold text-lg text-shadow-cyan-600 text-primary">
                  {user?.username}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div
                  aria-label="success"
                  className="status status-success"
                ></div>
                <p
                  className={
                    "text-success font-semibold text-shadow-neon-cyan"

                  }
                >
                  Online
                </p>
              </div>
           
              <div className="flex items-center gap-2 group duration-300">
                <div
                  className="hidden group-hover:flex items-center gap-2 cursor-pointer duration-300"
                  onClick={() => handleCopy(user?.phone)}
                >
                  <div className="text-success text font-black duration-300">
                    {copied ? "Copied!" : "Copy"}
                  </div>
                </div>
                <FaPhoneSquareAlt className="text-success text-2xl" />
                <a href={`tel:${user?.phone}`} className="text-success">
                  {user?.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <BsFillCalendarDateFill className="inline-block text-secondary text-shadow-sm text-shadow-secondary text-2xl" />
                <p className="text-secondary text-shadow-sm text-shadow-secondary">
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
            className="btn w-full flex items-center gap-3 justify-center hover:bg-red-600 font-bold shadow-neon-red rounded-lg transition duration-300"
            onClick={() => document.getElementById("my_modal_2").showModal()}
          >
            <span>Log out</span>
            <MdLogout size={20} />
          </button>

          <dialog id="my_modal_2" className="modal">
            <div className="modal-box bg-[#0a0a23] border border-neonRed rounded-lg shadow-neon-red text-neonRed">
              <h3 className="font-bold text-lg text-center mb-4">
                Log out of account
              </h3>
              <p className="text-center py-6">
                Are you sure you want to log out?
              </p>
              <div className="flex justify-center gap-6">
                <button
                  className="btn bg-neonRed hover:bg-red-600 text-black font-bold shadow-neon-red min-w-[140px]"
                  onClick={handleLogout}
                >
                  Yes
                </button>
                <button
                  className="btn bg-neonCyan hover:bg-cyan-400 text-black font-bold shadow-neon-cyan min-w-[140px]"
                  onClick={() =>
                    document.getElementById("my_modal_2").close()
                  }
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
export default UserDrawer;
