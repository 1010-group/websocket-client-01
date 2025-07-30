import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/slices/authSlice";
import socket from "../socket";
import { useNavigate, Link } from "react-router-dom";

// SVG иконки
const ShieldCheck = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
  </svg>
);

const Lock = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
  </svg>
);

const Phone = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
  </svg>
);

const Users = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
    <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.46 1.46 0 0 0 18.5 7c-.8 0-1.54.5-1.85 1.26l-1.92 5.75c-.3.9.47 1.99 1.41 1.99H18v6h2zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zm1.5 1h-2c-.83 0-1.5.67-1.5 1.5v6h2v7h3v-7h2v-6c0-.83-.67-1.5-1.5-1.5zM8 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm-.5 3c-.8 0-1.54.5-1.85 1.26L3.73 15.75c-.3.9.47 1.99 1.41 1.99H7v6h2v-6h2.5c.83 0 1.5-.67 1.5-1.5V12c0-.83-.67-1.5-1.5-1.5h-2z" />
  </svg>
);

const Fingerprint = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.81 4.47c-.08 0-.16-.02-.23-.06C15.66 3.42 14 3 12.01 3c-1.98 0-3.86.47-5.57 1.41-.24.13-.54.04-.68-.2-.13-.24-.04-.55.2-.68C7.82 2.52 9.86 2 12.01 2c2.13 0 3.99.47 6.03 1.52.25.13.34.43.21.67-.09.18-.26.28-.44.28zM3.5 9.72c-.1 0-.2-.03-.29-.09-.23-.16-.28-.47-.12-.7.99-1.4 2.25-2.5 3.75-3.27C9.98 4.04 14 4.03 17.15 5.65c1.5.77 2.76 1.86 3.75 3.25.16.22.11.54-.12.7-.23.16-.54.11-.7-.12-.9-1.26-2.04-2.25-3.39-2.94-2.87-1.47-6.54-1.47-9.4.01-1.36.7-2.5 1.7-3.4 2.96-.08.14-.23.21-.39.21zm6.25 12.07c-.13 0-.26-.05-.35-.15-.87-.87-1.34-2.04-1.34-3.3 0-2.58 2.07-4.68 4.62-4.68s4.68 2.09 4.68 4.68c0 .22-.18.4-.4.4s-.4-.18-.4-.4c0-2.14-1.78-3.88-3.88-3.88-2.14 0-3.82 1.74-3.82 3.88 0 1.04.37 2.04 1.04 2.79.15.17.13.44-.04.59-.08.08-.18.12-.29.12z" />
  </svg>
);

const ArrowRight = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
  </svg>
);

const Login = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone || !password) {
      setError("Заполните все поля.");
      return;
    }
    setError("");

    const server = true;
    const loginURL = server
      ? "https://websocket-server-01.onrender.com/api/users/login"
      : "http://localhost:5000/api/users/login";

    try {
      const response = await fetch(loginURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone, password }),
      });

      const data = await response.json();

      if (response.ok) {
        dispatch(loginSuccess({ user: data.user }));
        socket.emit("user_connected", data.user);
        navigate("/");
      } else {
        setError(data.message || "Ошибка при входе");
      }
    } catch (error) {
      setError("Ошибка при подключении к серверу.");
      console.error("Ошибка при входе:", error.message);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Левая часть - Мотивационная секция */}
      <div
        className="hidden lg:flex lg:w-2/3 relative overflow-hidden items-center justify-center"
        style={{
          background:
            "linear-gradient(135deg, #1e1e60 0%, #2e1065 30%, #0ea5e9 100%)",
        }}
      >
        {/* Анимированные элементы фона */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div
          className="absolute bottom-20 right-20 w-80 h-80 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-10 w-48 h-48 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>

        {/* Основной контент */}
        <div className="relative z-10 text-center max-w-2xl px-8">
          <div className="mb-8">
            <ShieldCheck />
            <h1
              className="text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              style={{
                background:
                  "linear-gradient(90deg, #0ea5e9, #ec4899, #a21caf)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 4px 20px #0ea5e955)",
              }}
            >
              Безопасность
              <br /> Превыше Всего
            </h1>
            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
              Пройдите авторизацию для получения доступа к защищенной системе
            </p>
          </div>

          {/* Особенности безопасности */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div
              className="p-6 rounded-2xl backdrop-blur-md border border-cyan-500 border-opacity-30"
              style={{
                background: "rgba(14, 165, 233, 0.1)",
                boxShadow: "0 0 30px rgba(14, 165, 233, 0.2)",
              }}
            >
              <Fingerprint className="text-cyan-400 mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Биометрическая защита
              </h3>
              <p className="text-gray-300 text-sm">
                Современные алгоритмы шифрования
              </p>
            </div>

            <div
              className="p-6 rounded-2xl backdrop-blur-md border border-pink-500 border-opacity-30"
              style={{
                background: "rgba(236, 72, 153, 0.1)",
                boxShadow: "0 0 30px rgba(236, 72, 153, 0.2)",
              }}
            >
              <Users className="text-pink-400 mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Проверка личности
              </h3>
              <p className="text-gray-300 text-sm">
                Многоуровневая аутентификация
              </p>
            </div>
          </div>

          <div className="text-gray-300">
            <p className="text-lg mb-4">🔐 Ваши данные под надежной защитой</p>
            <p className="text-sm opacity-75">
              Используем передовые технологии шифрования SSL/TLS
            </p>
          </div>
        </div>
      </div>

      {/* Правая часть - Форма входа */}
      <div
        className="w-full lg:w-1/3 flex items-center justify-center p-6 lg:p-12"
        style={{
          background: "linear-gradient(180deg, #1a1a3e 0%, #2d1b69 100%)",
        }}
      >
        <div className="w-full max-w-md">
          {/* Заголовок формы */}
          <div className="text-center mb-8">
            <div className="mb-6">
              <Lock
                className="mx-auto text-cyan-400"
                style={{ filter: "drop-shadow(0 0 15px #0ea5e9)" }}
              />
            </div>
            <h2
              className="text-3xl font-bold mb-2"
              style={{
                background:
                  "linear-gradient(90deg, #0ea5e9, #ec4899)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 2px 12px #0ea5e9aa)",
              }}
            >
              Вход в систему
            </h2>
            <p className="text-gray-300">Введите ваши учетные данные</p>
          </div>

          {/* Форма */}
          <div
            className="p-8 rounded-3xl shadow-2xl"
            style={{
              background: "rgba(16, 16, 40, 0.95)",
              boxShadow:
                "0 0 40px 10px rgba(58, 150, 255, 0.25), 0 0 0 4px rgba(139,92,246,0.15) inset",
              border: "1.5px solid rgba(34,211,238,0.18)",
            }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Поле телефона */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="text-gray-400" />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Введите номер телефона"
                  className="w-full pl-12 pr-4 py-4 bg-[#18183a] text-white rounded-xl border-none outline-none focus:ring-2 focus:ring-cyan-400 placeholder-gray-400 text-lg transition-all duration-300"
                  style={{
                    boxShadow:
                      phone !== ""
                        ? "0 0 16px 2px #0ea5e9aa"
                        : "0 0 0 0 transparent",
                  }}
                />
              </div>

              {/* Поле пароля */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Введите пароль"
                  className="w-full pl-12 pr-4 py-4 bg-[#18183a] text-white rounded-xl border-none outline-none focus:ring-2 focus:ring-pink-400 placeholder-gray-400 text-lg transition-all duration-300"
                  style={{
                    boxShadow:
                      password !== ""
                        ? "0 0 16px 2px #ec4899aa"
                        : "0 0 0 0 transparent",
                  }}
                />
              </div>

              {/* Кнопка входа */}
              <button
                type="submit"
                className="w-full p-4 rounded-xl font-bold text-lg flex items-center justify-center space-x-2 transition-all duration-300 hover:scale-105 active:scale-95"
                style={{
                  background:
                    "linear-gradient(90deg, #0ea5e9, #a21caf, #ec4899)",
                  color: "#fff",
                  boxShadow: "0 8px 32px 0 #a21caf55",
                }}
              >
                <span>Войти в систему</span>
                <ArrowRight />
              </button>
            </form>

            {/* Сообщение об ошибке */}
            {error && (
              <div className="mt-6 p-4 bg-red-900 bg-opacity-50 backdrop-blur-sm border border-red-500 border-opacity-50 rounded-xl">
                <p className="text-red-300 text-center font-medium">
                  ⚠️ {error}
                </p>
              </div>
            )}

   
            {/* Дополнительные опции */}
            <div className="mt-6 text-center space-y-4">
              <div className="border-t border-gray-600 pt-4">
                <p className="text-gray-300">
                  Нет аккаунта?{" "}
                  <Link
                    to="/register"
                    className="text-cyan-400 hover:text-pink-400 underline font-medium transition-colors duration-300 cursor-pointer"
                  >
                    Создать аккаунт
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
// ...existing code...