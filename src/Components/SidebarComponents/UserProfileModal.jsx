import React from 'react';
import { FaPhoneSquareAlt } from 'react-icons/fa';
import { BsFillCalendarDateFill } from 'react-icons/bs';
import { MdOutlineDriveFileRenameOutline } from 'react-icons/md';

const UserProfileModal = ({
    handleCopy,
    copied,
    selectedModalUser,
    currentUser,
    onClose,
    onBan,
    onKick,
    onMute,
    onUnmute,
    onWarn,
    onUnban,
    onMakeAdmin,
    isChangingRole
}) => {
    return (
        <dialog id="my_modal_1" className="modal">
            <div className="modal-box flex mb-4 w-full">
                <div className="modal-action flex-1 flex justify-center w-full">
                    <form method="dialog" className="w-full">
                        <div className="flex flex-col w-full gap-2 mb-4">
                            <div className="flex w-full gap-4 items-center">
                                <img
                                    className="w-14 h-14 rounded-full border-2 border-cyan-600 shadow-cyan-600 shadow-2xl"
                                    src={
                                        selectedModalUser?.image ||
                                        'https://static.vecteezy.com/system/resources/thumbnails/028/149/256/small_2x/3d-user-profile-icon-png.png'
                                    }
                                    alt={selectedModalUser?.username}
                                />
                                <div className="flex flex-col items-center gap-2">
                                    <p className="font-bold text-lg flex gap-2 text-shadow-cyan-600 text-primary">
                                        <MdOutlineDriveFileRenameOutline className="text-primary text-2xl" />
                                        {selectedModalUser?.username || currentUser?.username}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <div
                                            aria-label={selectedModalUser?.status ? 'success' : 'error'}
                                            className={selectedModalUser?.status ? 'status status-success' : 'status status-error'}
                                        ></div>
                                        <p className={selectedModalUser?.status ? 'text-success font-semibold text-shadow-success' : 'text-error font-semibold text-shadow-error'}>
                                            {selectedModalUser?.status ? 'Online' : 'Offline'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col w-full gap-4">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 group duration-300">
                                    <div
                                        className="hidden group-hover:flex items-center gap-2 cursor-pointer duration-300"
                                        onClick={() => handleCopy(selectedModalUser?.phone || currentUser?.phone)}
                                    >
                                        <div className="text-success text font-black duration-300">
                                            {copied ? 'Copied!' : 'Copy'}
                                        </div>
                                    </div>
                                    <FaPhoneSquareAlt className="text-success text-2xl" />
                                    <a href={`tel:${selectedModalUser?.phone || currentUser?.phone}`} className="text-success">
                                        {selectedModalUser?.phone || currentUser?.phone}
                                    </a>
                                </div>
                                <div className="flex items-center gap-2">
                                    <BsFillCalendarDateFill className="inline-block text-secondary text-2xl" />
                                    <p className="text-secondary">
                                        {selectedModalUser?.birthDate || currentUser?.birthDate
                                            ? new Date(selectedModalUser?.birthDate || currentUser?.birthDate).toLocaleDateString('en-CA')
                                            : '-'}
                                    </p>
                                </div>
                            </div>

                            {['admin', 'owner'].includes(currentUser?.role) && (
                                <div className="flex flex-col w-full gap-4">
                                    <p className="text-2xl text-accent font-semibold text-shadow-sm text-shadow-accent">
                                        Панель Администратора
                                    </p>
                                    <div className=" flex flex-wrap justify-center gap-2 rounded-lg">

                                        {/* Ban / Unban */}
                                        {selectedModalUser?.isBanned ? (
                                            <button
                                                type="button"
                                                className="btn btn-soft btn-success m-1 w-1/4 "
                                                onClick={() => onUnban(selectedModalUser._id)}
                                            >
                                                Unban
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                className="btn btn-soft btn-error m-1 w-1/4"
                                                onClick={() => onBan(currentUser._id, selectedModalUser?._id, "Noma'lum sabab")}
                                                disabled={selectedModalUser?.role === 'owner'}
                                            >
                                                Ban
                                            </button>
                                        )}

                                        {/* Mute / Unmute */}
                                        {selectedModalUser?.isMuted ? (
                                            <button
                                                type="button"
                                                className="btn btn-soft btn-success m-1 w-1/4"
                                                onClick={onUnmute}
                                            >
                                                Unmute
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                className="btn btn-soft btn-error m-1 w-1/4"
                                                onClick={() => onMute(currentUser._id, selectedModalUser?._id, 'mute')}
                                            >
                                                Mute
                                            </button>
                                        )}

                                        {/* Kick */}
                                        <button
                                            type="button"
                                            onClick={() => onKick(currentUser._id, selectedModalUser?._id)}
                                            className="btn btn-soft btn-error m-1 w-1/4"
                                        >
                                            Kick
                                        </button>

                                        {/* Warn */}
                                        {!selectedModalUser?.isBanned && (
                                            <button
                                                type="button"
                                                className="btn btn-soft btn-warning m-1 w-1/4"
                                                onClick={() => onWarn(selectedModalUser._id)}
                                                disabled={selectedModalUser?.role === 'owner'}
                                            >
                                                Warning ({selectedModalUser?.isWarn || 0}/3)
                                            </button>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap w-full flex-1 gap-2">

                                        <div className="flex justify-center flex-col items-center w-full py-5">
                                            <p className="w-full px-3 mb-2">Роль:</p>
                                            <div role="tablist" className="tabs tabs-box">
                                                {['owner', 'admin', 'moderator', 'user'].map((role) => (
                                                    <p
                                                        key={role}
                                                        role="tab"
                                                        className={`tab ${selectedModalUser?.role === role
                                                            ? `tab-active ${role === 'admin'
                                                                ? 'text-primary'
                                                                : role === 'moderator'
                                                                    ? 'text-secondary'
                                                                    : 'text-white'}`
                                                            : ''
                                                            }`}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            if (selectedModalUser?.role !== 'owner') {
                                                                onMakeAdmin(currentUser._id, selectedModalUser._id, role);
                                                            }
                                                        }}
                                                        disabled={selectedModalUser?.role === 'owner' || isChangingRole}
                                                    >
                                                        {role === 'owner' ? 'Owner' : role === 'admin' ? 'Admin' : role === 'moderator' ? 'Moderator' : 'User'}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <button type="button" className="btn btn-error text-white w-72" onClick={onClose}>
                                Close
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </dialog>
    );
};

export default UserProfileModal;
