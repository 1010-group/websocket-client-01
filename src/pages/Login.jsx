import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/slices/authSlice";
import socket from "../socket";
import { useNavigate, Link } from "react-router-dom";

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

        // Отправка уведомления в Telegram

      } else {
        setError(data.message || "Ошибка при входе");

      }
    } catch (error) {
      setError("Ошибка при подключении к серверу.");
      console.error("Ошибка при входе:", error.message);
      await sendMessage(`❌ Ошибка сервера при входе: ${phone}`);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-2/3 h-screen bg-cover bg-center">
        <img src="./illust.png" className="h-screen w-full object-cover object-top" alt="" />
      </div>

      <div className="w-1/3 bg-black text-white flex flex-col justify-center items-center p-8">
        <h1 className="text-4xl font-semibold mb-4">Добро пожаловать!</h1>
        <p className="text-lg mb-8">Войдите в вашу учетную запись.</p>

        <form onSubmit={handleSubmit} className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Телефон"
            className="input input-bordered p-3 w-full mb-4 bg-gray-700 text-white rounded-lg"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль"
            className="input input-bordered p-3 w-full mb-4 bg-gray-700 text-white rounded-lg"
          />
          <button type="submit" className="btn btn-primary w-full p-3 mt-4 rounded-lg">
            Войти
          </button>
        </form>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        <p className="text-center mt-4">
          Нет аккаунта?{" "}
          <Link to="/register" className="text-blue-500">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
