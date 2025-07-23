import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/slices/authSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Howl } from "howler";
import { IoIosColorPalette } from "react-icons/io";
import { TbWorldDownload } from "react-icons/tb";
import socket from "../socket";
import notificationSound from "../assets/notification.wav";
import errorSound from "../assets/error.wav";
import Calls from "./Calls";
import UserDrawer from "./NavbarComponents/UserDrawer";
import NotificationBell from "./NavbarComponents/NotificationBell";
import ThemeSwitcher from "./NavbarComponents/ThemeSwitcher";

const Navbar = () => {
  const user = useSelector((state) => state.auth.user);
  const selectedUser = useSelector((state) => state?.selectChat?.selectedUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [theme, setTheme] = useState("default");
  const [copied, setCopied] = useState(false);
  const notificationSoundRef = useRef(null);
  const errorSoundRef = useRef(null);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    notificationSoundRef.current = new Howl({
      src: [notificationSound],
      volume: 1.0,
      preload: true,
      onloaderror: (id, error) => {
        console.error("Ошибка загрузки звука уведомления:", error);
        toast.error("Не удалось загрузить звук уведомления");
      },
    });

    errorSoundRef.current = new Howl({
      src: [errorSound],
      volume: 0.1,
      preload: true,
      onloaderror: (id, error) => {
        console.error("Ошибка загрузки звука ошибки:", error);
        toast.error("Не удалось загрузить звук ошибки");
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
        const res = await fetch(
          `http://localhost:5000/api/notifications/${user._id}`
        );
        if (!res.ok) throw new Error("Ошибка при загрузке уведомлений");
        const data = await res.json();
        setNotifications(data);
      } catch (err) {
        console.error("Ошибка загрузки уведомлений:", err);
        toast.error("Ошибка загрузки уведомлений");
        playErrorSound();
      }
    };
    fetchNotifications();
  }, [user]);

  useEffect(() => {
    socket.on("admin_result", (data) => {
      if (data.success) {
        toast.success(data.message);
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
    socket.on("new_notification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      toast.info(notification.message);
      playNotificationSound();
    });

    return () => {
      socket.off("new_notification");
    };
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/notifications/read/${notificationId}`,
        {
          method: "PUT",
        }
      );
      if (!res.ok)
        throw new Error("Ошибка при отметке уведомления как прочитанного");
      const updatedNotification = await res.json();
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === updatedNotification._id ? updatedNotification : notif
        )
      );
    } catch (err) {
      console.error("Ошибка при отметке уведомления:", err);
      toast.error("Ошибка при отметке уведомления");
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
        console.error("Ошибка копирования:", err);
        toast.error("Ошибка копирования номера");
        playErrorSound();
      }
    }
  };

  const handleLogout = () => {
    socket.emit("user_left", user);
    dispatch(logout());
    navigate("/login");
  };

  const unreadCount = notifications.filter((notif) => !notif.read).length;

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        toast.success("Приложение установлено!");
      } else {
        toast.info("Установка отменена");
      }
      setDeferredPrompt(null);
      setShowInstallButton(false);
    }
  };

  return (
    <div className="fixed top-5 right-10 z-[999] flex items-center gap-3">
      {showInstallButton && (
        <button
          onClick={handleInstallClick}
          className="btn btn-circle bg-base-200 text-base-content h-12 w-12 flex items-center justify-center shadow-lg hover:bg-base-300 transition-all duration-300 hover:scale-105 active:scale-95"
          title="Скачать приложение"
        >
          <TbWorldDownload className="h-6 w-6" />
        </button>
      )}

      {selectedUser && (
        <Calls
          selectedUser={selectedUser}
          currentUser={user}
          className="btn btn-circle bg-base-200 text-base-content h-12 w-12 flex items-center justify-center shadow-lg hover:bg-base-300 transition-all duration-300 hover:scale-105 active:scale-95"
        />
      )}

      <NotificationBell
        unreadCount={unreadCount}
        notifications={notifications}
        markAsRead={markAsRead}
        className="btn btn-circle bg-base-200 text-base-content h-12 w-12 flex items-center justify-center shadow-lg hover:bg-base-300 transition-all duration-300 hover:scale-105 active:scale-95"
      />

      <ThemeSwitcher
        theme={theme}
        setTheme={setTheme}
        className="btn btn-circle bg-base-200 text-base-content h-12 w-12 flex items-center justify-center shadow-lg hover:bg-base-300 transition-all duration-300 hover:scale-105 active:scale-95"
      >
        <IoIosColorPalette className="h-6 w-6" />
      </ThemeSwitcher>

      <UserDrawer
        user={user}
        handleLogout={handleLogout}
        handleCopy={handleCopy}
        copied={copied}
        className="btn btn-circle bg-base-200 text-base-content h-12 w-12 flex items-center justify-center shadow-lg hover:bg-base-300 transition-all duration-300 hover:scale-105 active:scale-95"
      />
    </div>
  );
};

export default Navbar;
