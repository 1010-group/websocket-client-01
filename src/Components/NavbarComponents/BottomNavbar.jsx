import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { logout, updateUserStatus } from '../../redux/slices/authSlice';

import { IoSettingsSharp, IoNotifications } from 'react-icons/io5';
import { FaPhoneSquareAlt } from 'react-icons/fa';
import { BsFillCalendarDateFill } from 'react-icons/bs';
import { MdLogout, MdOutlineDriveFileRenameOutline } from 'react-icons/md';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Howl } from 'howler';
import socket from '../../socket';



import Calls from '../Calls';
import NotificationBell from './NotificationBell';
import ThemeSwitcher from './ThemeSwitcher';
import UserDrawer from './UserDrawer';
import UserModal from './UserModal';

const BottomNavbar = () => {
    const { chatId } = useParams()
    console.log(chatId)
    const user = useSelector((state) => state.auth.user);
    const selectedUser = useSelector((state) => state?.selectChat?.selectedUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [theme, setTheme] = useState('default');
    const [copied, setCopied] = useState(false);
    const notificationSoundRef = useRef(null);
    const errorSoundRef = useRef(null);



   

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

  

    return (
        <div className="dock bg-base-300 text-neutral-content flex items-center justify-center  ">
          

            <div className="dropdown dropdown-top">
                <ThemeSwitcher theme={theme} setTheme={setTheme} />
            </div>

            <div>
                <UserModal
                    user={user}
                    handleLogout={handleLogout}
                    handleCopy={handleCopy}
                    copied={copied}
                    onClose={() => document.getElementById('my_modal_user').close()}
                />
            </div>

        </div>
    )
}

export default BottomNavbar