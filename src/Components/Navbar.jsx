import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, updateUserStatus } from '../redux/slices/authSlice';
import { IoNotifications } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { Howl } from 'howler';
import socket from '../socket';
import Battery from './NavbarComponents/Battery';
import NavbarDrawer from './NavbarComponents/NavbarDrawer';
import notificationSound from '../assets/notification.wav';
import errorSound from '../assets/error.wav';
import ThemeDropdown from './NavbarComponents/ThemeDropdown';
import NotificationDropdown from './NavbarComponents/NotificationDropdown';

const Navbar = () => {
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [theme, setTheme] = useState('default');
    const [copied, setCopied] = useState(false);
    const notificationSoundRef = useRef(null);
    const errorSoundRef = useRef(null);



    const handleOpenModal = (user) => {
        if (!user) return;
        toast.info(`User: ${user.username || 'Unknown'}`);
        // Или можешь открыть модальное окно, если оно у тебя есть
    };


    useEffect(() => {
        notificationSoundRef.current = new Howl({
            src: [notificationSound],
            volume: 1,
            preload: true,
            onloaderror: (id, error) => {
                console.error('Error loading notification sound:', error);
                toast.error('Failed to load notification sound');
            },
        });

        errorSoundRef.current = new Howl({
            src: [errorSound],
            volume: 1,
            preload: true,
            onloaderror: (id, error) => {
                console.error('Error loading error sound:', error);
                toast.error('Failed to load error sound');
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
                const res = await fetch(`http://localhost:5000/api/notifications/${user._id}`, {
                    credentials: 'include',
                });
                if (!res.ok) throw new Error('Error fetching notifications');
                const data = await res.json();
                setNotifications(data);
            } catch (err) {
                console.error('Error fetching notifications:', err);
                toast.error('Error fetching notifications');
                playErrorSound();
            }
        };
        fetchNotifications();
    }, [user]);

    useEffect(() => {
        socket.on('admin_result', (data) => {
            if (data.success) {
                toast.success(data.message);
                setNotifications((prev) => prev.map((notif) =>
                    notif._id === data.user._id ? { ...notif, role: data.user.role } : notif
                ));
            } else {
                toast.error(data.message);
            }
        });

        socket.on('broadcast_message', (data) => {
            toast.info(data.message);
        });

        socket.on('personal_message', (data) => {
            toast.warning(data.message);
        });

        return () => {
            socket.off('admin_result');
            socket.off('broadcast_message');
            socket.off('personal_message');
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
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!res.ok) throw new Error('Error marking notification as read');
            const updatedNotification = await res.json();
            setNotifications((prev) =>
                prev.map((notif) =>
                    notif._id === updatedNotification._id ? updatedNotification : notif
                )
            );
        } catch (err) {
            console.error('Error marking notification:', err);
            toast.error('Error marking notification');
            playErrorSound();
        }
    };

    const clearAllNotifications = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/notifications/${user._id}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!res.ok) throw new Error('Error clearing notifications');
            setNotifications([]);
            toast.success('All notifications cleared');
        } catch (err) {
            console.error('Error clearing notifications:', err);
            toast.error('Error clearing notifications');
            playErrorSound();
        }
    };

    const handleCopyName = async (fullName) => {
        if (fullName) {
            try {
                await navigator.clipboard.writeText(fullName);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error('Error copying:', err);
                toast.error('Error copying full name');
            }
        }
    };

    const handleCopy = async (phone) => {
        if (phone) {
            try {
                await navigator.clipboard.writeText(phone);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error('Error copying:', err);
                toast.error('Error copying phone number');
                playErrorSound();
            }
        }
    };

    const handleLogout = () => {
        socket.emit('user_left', user);
        dispatch(logout());
        // navigate('/login');
    };

    const unreadCount = notifications.filter((notif) => !notif.read).length;

    return (
        <div className="fixed top-5 right-10 z-[999] flex items-center gap-4">
            <NotificationDropdown
                notifications={notifications}
                unreadCount={unreadCount}
                markAsRead={markAsRead}
                clearAllNotifications={clearAllNotifications}
                handleOpenModal={handleOpenModal}
            />


            <ThemeDropdown />

            <NavbarDrawer
                user={user}
                handleCopy={handleCopy}
                handleCopyName={handleCopyName}
                copied={copied}
                handleLogout={handleLogout}
            />
        </div>
    );
};

export default Navbar;