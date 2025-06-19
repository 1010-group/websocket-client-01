import React from 'react';
import { FaPhoneSquareAlt } from 'react-icons/fa';
import { BsFillCalendarDateFill } from 'react-icons/bs';
import { MdOutlineDriveFileRenameOutline } from 'react-icons/md';

const UserProfileModal = ({
    user,
    selectedModalUser,
    handleCopy,
    copied,
    handleBan,
    handleWarn,
    handleUnban,
    makeAdmin,
    isChangingRole,
}) => {

    console.log(selectedModalUser.description)
    return (
        <dialog id="my_modal_1" className="modal">
            <div className="modal-box backdrop-blur-md w-80 shadow-2xl shadow-primary text-base-content flex flex-col gap-6 p-6 rounded-lg">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                            <img
                                className="w-14 h-14 rounded-full border-2 border-cyan-600 shadow-cyan-600 shadow-2xl"
                                src={
                                    selectedModalUser?.image ||
                                    user?.image ||
                                    'https://static.vecteezy.com/system/resources/thumbnails/028/149/256/small_2x/3d-user-profile-icon-png.png'
                                }
                                alt={selectedModalUser?.username || user?.username}
                            />
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <MdOutlineDriveFileRenameOutline className="text-primary text-2xl" />
                                    <p className="font-bold text-lg text-primary text-shadow-cyan-600">
                                        {selectedModalUser?.username || user?.username}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div
                                        aria-label={selectedModalUser?.status ? 'success' : 'error'}
                                        className={selectedModalUser?.status ? 'status status-success' : 'status status-error'}
                                    ></div>
                                    <p
                                        className={
                                            selectedModalUser?.status
                                                ? 'text-success font-semibold text-shadow-success'
                                                : 'text-error font-semibold text-shadow-error'
                                        }
                                    >
                                        {selectedModalUser?.status ? 'Online' : 'Offline'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 group duration-300">
                                <div
                                    className="hidden group-hover:flex items-center gap-2 cursor-pointer duration-300"
                                    onClick={() => handleCopy(selectedModalUser?.phone || user?.phone)}
                                >
                                    <div className="text-success font-bold duration-300">
                                        {copied ? 'Copied!' : 'Copy'}
                                    </div>
                                </div>
                                <FaPhoneSquareAlt className="text-success text-2xl" />
                                <a href={`tel:${selectedModalUser?.phone || user?.phone}`} className="text-success">
                                    {selectedModalUser?.phone || user?.phone || '-'}
                                </a>
                            </div>
                            <div className="flex items-center gap-2">
                                <BsFillCalendarDateFill className="inline-block text-secondary text-2xl" />
                                <p className="text-secondary">
                                    {selectedModalUser?.birthDate || user?.birthDate
                                        ? new Date(selectedModalUser?.birthDate || user?.birthDate).toLocaleDateString('en-CA')
                                        : '-'}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <p className="text-primary font-semibold">Role:</p>
                                <p className="text-primary capitalize">
                                    {selectedModalUser?.role || user?.role || 'User'}
                                </p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="text-primary font-semibold">Description:</p>
                                <p className="text-base-content">
                                    {selectedModalUser?.description || 'No description provided'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                {['admin', 'owner'].includes(user?.role) && (
                    <div className="flex flex-col gap-4">
                        <p className="text-2xl text-accent font-semibold text-shadow-sm text-shadow-accent">
                            Панель Администратора
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <button
                                className="btn btn-soft btn-error m-1 flex-1"
                                onClick={() => handleBan(selectedModalUser?._id)}
                                disabled={selectedModalUser?.isBanned || selectedModalUser?.role === 'owner'}
                            >
                                Заблокировать
                            </button>
                            <button
                                className="btn btn-soft btn-error m-1 flex-1"
                                onClick={() =>
                                    selectedModalUser?.isMuted
                                        ? handleUnmute(selectedModalUser?._id)
                                        : handleMute(selectedModalUser?._id)
                                }
                                disabled={selectedModalUser?.role === 'owner'}
                            >
                                {selectedModalUser?.isMuted ? 'Unmute' : 'Mute'}
                            </button>

                            {!selectedModalUser?.isBanned && (
                                <button
                                    className="btn btn-soft btn-error m-1 flex-1"
                                    onClick={() => handleWarn(selectedModalUser?._id)}
                                    disabled={selectedModalUser?.role === 'owner'}
                                >
                                    Warning ({selectedModalUser?.isWarn || 0}/3)
                                </button>
                            )}
                            <button
                                className="btn btn-soft btn-success m-1 flex-1"
                                onClick={() => handleUnban(selectedModalUser?._id)}
                            >
                                Unban
                            </button>
                        </div>
                        <div className="flex flex-col items-center w-full py-5">
                            <p className="w-full px-3 mb-2 text-primary font-semibold">Роль:</p>
                            <div role="tablist" className="tabs tabs-box w-full">
                                {['admin', 'moderator', 'user'].map((role) => (
                                    <p
                                        key={role}
                                        role="tab"
                                        className={`tab flex-1 text-center ${selectedModalUser?.role === role
                                            ? `tab-active ${role === 'admin'
                                                ? 'text-primary'
                                                : role === 'moderator'
                                                    ? 'text-secondary'
                                                    : 'text-white'
                                            }`
                                            : ''
                                            }`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (selectedModalUser?.role !== 'owner') {
                                                makeAdmin(user._id, selectedModalUser._id, role);
                                            }
                                        }}
                                        disabled={selectedModalUser?.role === 'owner' || isChangingRole}
                                    >
                                        {role === 'admin' ? 'Администратор' : role === 'moderator' ? 'Модератор' : 'Пользователь'}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                <form method="dialog" className="w-full">
                    <button className="btn btn-error text-white w-full mt-4">Close</button>
                </form>
            </div>
        </dialog>
    );
};

export default UserProfileModal;