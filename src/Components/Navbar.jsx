import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, updateUserStatus } from '../redux/slices/authSlice';
import { IoSettingsSharp, IoNotifications } from 'react-icons/io5';
import { FaPhoneSquareAlt } from 'react-icons/fa';
import { BsFillCalendarDateFill } from 'react-icons/bs';
import { MdLogout, MdOutlineDriveFileRenameOutline } from 'react-icons/md';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Howl } from 'howler';
import socket from '../socket';
import notificationSound from '../assets/notification.wav';
import errorSound from '../assets/error.wav';


const Navbar = () => {
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [theme, setTheme] = useState('default');
    const [copied, setCopied] = useState(false);
    const notificationSoundRef = useRef(null);
    const errorSoundRef = useRef(null);



    useEffect(() => {
        notificationSoundRef.current = new Howl({
            src: [notificationSound],
            volume: 100,
            preload: true,
            onloaderror: (id, error) => {
                console.error('Ошибка загрузки звука уведомления:', error);
                toast.error('Не удалось загрузить звук уведомления');
            },
        });

        errorSoundRef.current = new Howl({
            src: [errorSound],
            volume: 10,
            preload: true,
            onloaderror: (id, error) => {
                console.error('Ошибка загрузки звука ошибки:', error);
                toast.error('Не удалось загрузить звук ошибки');
            },
        });

        return () => {
            notificationSoundRef.current?.unload();
            errorSoundRef.current?.unload();
        };
    }, []);

    const playNotificationSound = () => {
        if (notificationSoundRef.current) {
            notificationSoundRef.current.play();
        }
    };

    const playErrorSound = () => {
        if (errorSoundRef.current) {
            errorSoundRef.current.play();
        }
    };

    useEffect(() => {
        if (!user?._id) return;
        const fetchNotifications = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/notifications/${user._id}`);
                if (!res.ok) throw new Error('Ошибка при загрузке уведомлений');
                const data = await res.json();
                setNotifications(data);
            } catch (err) {
                console.error('Ошибка загрузки уведомлений:', err);
                toast.error('Ошибка загрузки уведомлений');
                playErrorSound();
            }
        };
        fetchNotifications();
    }, [user]);
    useEffect(() => {
        socket.on("admin_result", (data) => {
            if (data.success) {
                toast.success(data.message);
                setSelectedModalUser((prev) => ({
                    ...prev,
                    role: data.user.role,
                }));
            } else {
                toast.error(data.message);
            }
        });

        socket.on("broadcast_message", (data) => {
            toast.info(data.message);
        });

        socket.on("personal_message", (data) => {
            toast.warning(data.message);
        });

        return () => {
            socket.off("admin_result");
            socket.off("broadcast_message");
            socket.off("personal_message");
        };
    }, []);

    useEffect(() => {
        socket.on('new_notification', (notification) => {
            setNotifications((prev) => [notification, ...prev]);
            toast.info(notification.message);
            playNotificationSound();
        });

        return () => {
            socket.off('new_notification');
        };
    }, []);

    const markAsRead = async (notificationId) => {
        try {
            const res = await fetch(`http://localhost:5000/api/notifications/read/${notificationId}`, {
                method: 'PUT',
            });
            if (!res.ok) throw new Error('Ошибка при отметке уведомления как прочитанного');
            const updatedNotification = await res.json();
            setNotifications((prev) =>
                prev.map((notif) =>
                    notif._id === updatedNotification._id ? updatedNotification : notif
                )
            );
        } catch (err) {
            console.error('Ошибка при отметке уведомления:', err);
            toast.error('Ошибка при отметке уведомления');
            playErrorSound();
        }
    };

    const handleCopy = async (phone) => {
        if (phone) {
            try {
                await navigator.clipboard.writeText(phone);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error('Ошибка копирования:', err);
                toast.error('Ошибка копирования номера');
                playErrorSound();
            }
        }
    };

    const handleLogout = () => {
        socket.emit('user_left', user);
        dispatch(logout());
        navigate('/login');
    };

    const unreadCount = notifications.filter((notif) => !notif.read).length;

    return (
        <div className="fixed top-5 right-10 z-[999] flex items-center gap-4">
            <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn m-1 w-20 h-10 relative">
                    <IoNotifications size={24} />
                    {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {unreadCount}
                        </span>
                    )}
                </div>
                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-80 p-2 shadow-md shadow-primary max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                        <li><p className="text-gray-400">No notifications</p></li>
                    ) : (
                        notifications.map((notif) => (
                            <li
                                key={notif._id}
                                className={`p-2 border-b ${notif.read ? 'bg-base-200' : 'bg-base-100'} hover:bg-base-300 cursor-pointer`}
                                onClick={() => !notif.read && markAsRead(notif._id)}
                            >
                                <div className="flex items-center gap-2">
                                    <img
                                        className="w-8 h-8 rounded-full"
                                        src={notif.fromUser?.image || "https://static.vecteezy.com/system/resources/thumbnails/028/149/256/small_2x/3d-user-profile-icon-png.png"}
                                        alt={notif.fromUser?.username || "System"}
                                    />
                                    <div>
                                        <p className="font-semibold">{notif.fromUser?.username || "System"}</p>
                                        <p className="text-sm">{notif.message}</p>
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

            <div className="dropdown dropdown-start">
                <div tabIndex={0} role="button" className="btn m-1 w-20 h-10">{theme}</div>
                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-45 p-2 shadow-md shadow-primary">
                    <div className="join join-vertical w-full">
                        <input
                            type="radio"
                            name="theme-buttons"
                            className="btn theme-controller join-item"
                            aria-label="Default"
                            value="default"
                            onChange={(e) => setTheme(e.target.value)}
                        />
                        <input
                            type="radio"
                            name="theme-buttons"
                            className="btn theme-controller join-item"
                            aria-label="Luxury"
                            value="luxury"
                            onChange={(e) => setTheme(e.target.value)}
                        />
                        <input
                            type="radio"
                            name="theme-buttons"
                            className="btn theme-controller join-item"
                            aria-label="Retro"
                            value="retro"
                            onChange={(e) => setTheme(e.target.value)}
                        />
                        <input
                            type="radio"
                            name="theme-buttons"
                            className="btn theme-controller join-item"
                            aria-label="Synthwave"
                            value="synthwave"
                            onChange={(e) => setTheme(e.target.value)}
                        />
                        <input
                            type="radio"
                            name="theme-buttons"
                            className="btn theme-controller join-item"
                            aria-label="Silk"
                            value="silk"
                            onChange={(e) => setTheme(e.target.value)}
                        />
                        <input
                            type="radio"
                            name="theme-buttons"
                            className="btn theme-controller join-item"
                            aria-label="Sunset"
                            value="sunset"
                            onChange={(e) => setTheme(e.target.value)}
                        />
                    </div>
                </ul>
            </div>

            <div className="drawer">
                <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                    <label
                        htmlFor="my-drawer"
                        className="btn bg-neonCyan hover:bg-cyan-400 shadow-neon-cyan transition duration-300 drawer-button"
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
                    <div className="backdrop-blur-md w-3/12 shadow-2xl shadow-cyan-500 text-neonCyan flex flex-col justify-between min-h-full p-6 space-y-6 shadow-neon-cyan rounded-lg">
                        <div className="flex flex-col gap-6">
                            <div className="flex gap-4 flex-col">
                                <img
                                    className="w-14 h-14 rounded-full border-2 border-cyan-600 shadow-cyan-600 shadow-2xl"
                                    src={
                                        user?.image ||
                                        "https://static.vecteezy.com/system/resources/thumbnails/028/149/256/small_2x/3d-user-profile-icon-png.png"
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
        </div>
    );
};

export default Navbar;
