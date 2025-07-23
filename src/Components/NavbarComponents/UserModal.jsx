import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaPhoneSquareAlt } from 'react-icons/fa';
import { BsFillCalendarDateFill } from 'react-icons/bs';
import { MdCalendarMonth, MdOutlineDriveFileRenameOutline, MdPhone } from 'react-icons/md';
import { FaPenNib, FaUserLarge } from "react-icons/fa6";
import { IoMdAt, IoMdSettings } from 'react-icons/io';
import NotificationBell from './NotificationBell';
import notificationSound from '../../assets/notification.wav';
import errorSound from '../../assets/error.wav';
import socket from '../../socket';
import { toast } from 'react-toastify';

const UserModal = ({ user, handleLogout, handleCopy, copied, onClose }) => {

  const [notifications, setNotifications] = useState([]);
  const currentUser = useSelector((state) => state.auth.user);
  console.log("currenctUser: ", currentUser )
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
        // toast.error('Ошибка загрузки уведомлений');
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
      console.log("data: ", data.message)
      toast.info(data.message);
    });

    socket.on("personal_message", (data) => {
      console.log("data: ", data.message)
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
  const unreadCount = notifications.filter((notif) => !notif.read).length;


  return (
    <div className="">
      <button className="btn" onClick={() => document.getElementById('my_modal_user').showModal()}>
        <IoMdSettings className="text-2xl text-primary text-shadow-xl text-shadow-primary"/>
      </button>

      <dialog id="my_modal_user" className="modal">
        <div className="modal-box flex mb-4 w-full">
          <div className="modal-action flex-1 flex justify-center w-full">
            <form method="dialog" className="w-full">

              <div className="flex flex-col w-full gap-4">
                <div className="flex flex-row-reverse w-full gap-2 mb-4 ">
                  <div className="ml- flex items-center justify-between">
                    <div className="p">
                      <NotificationBell
                        unreadCount={unreadCount}
                        notifications={notifications}
                        markAsRead={markAsRead}
                      />
                    </div>
                  </div>
                  <div className="flex w-full gap-4 items-center">
                    <img
                      className="w-14 h-14 rounded-full border-2 border-cyan-600 shadow-cyan-600 shadow-2xl"
                      src={
                        user?.image ||
                        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScdIYuCdg369Zi9PDQqmDljt26Co3bVUf4wA&sg'
                      }
                      alt={user?.username}
                    />

                    <div className="flex flex-col  items-center gap-2 ">
                      <div className="">
                        <p className="font-bold text-lg flex gap-2 text-shadow-cyan-600 text-primary">
                          <MdOutlineDriveFileRenameOutline className="text-primary text-2xl" />
                          {user?.username || currentUser?.username}
                        </p>
                      </div>
                      <div className="flex items justify-between gap-2">
                        <div
                          aria-label={user?.status ? 'success' : 'error'}
                          className={user?.status ? 'status status-success' : 'status status-error'}
                        ></div>
                        <p className={user?.status ? 'text-success font-semibold text-shadow-success' : 'text-error font-semibold text-shadow-error'}>
                          {user?.status ? 'Online' : 'Offline'}
                        </p>

                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 group duration-300">
                      <div
                        className="hidden group-hover:flex items-center gap-2 cursor-pointer duration-300"
                        onClick={() => handleCopy(user?.phone)}
                      >
                        <div className="text-success text font-black duration-300">
                          {copied ? "Copied!" : "Copy"}
                        </div>
                      </div>
                      <MdPhone className="text-success text-2xl" />
                      <a href={`tel:${user?.phone}`} className="text-success">
                        {user?.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <MdCalendarMonth className="inline-block text-secondary text-2xl" />
                      <p className="text-secondary">
                        {user?.birthDate
                          ? new Date(user?.birthDate).toLocaleDateString('en-CA')
                          : '-'}
                      </p>
                    </div>
                    <div className="">
                      <p className="font-bold text-lg flex gap-2 text-shadow-cyan-600 text-primary">
                        <FaUserLarge className="text-primary text-2xl" />
                        {user?.role || currentUser?.role}
                      </p>
                    </div>
                    <div className="">
                      <p className="font-bold text-lg flex gap-2 text-shadow-cyan-600 text-primary">
                        <FaPenNib className="text-primary text-2xl" />
                        {user?.description || currentUser?.description}
                      </p>
                    </div>
                    <div className="">
                      <p className="font-bold text-lg flex gap-2 text-shadow-cyan-600 text-primary">
                        <IoMdAt className="text-primary text-2xl" />
                        {user?.fullName || currentUser?.fullName}
                      </p>
                    </div>
                  </div>


                </div>

                <div className="flex items-center justify-center gap-2 mt-4">

                  <button
                    type="button"
                    className="btn btn-error text-white w-1/2 self-center"
                    onClick={handleLogout}
                  >
                    Log out
                  </button>
                  <button type="button" className="btn btn-error text-white w-1/2 self-center" onClick={onClose}>
                    Close
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default UserModal;
