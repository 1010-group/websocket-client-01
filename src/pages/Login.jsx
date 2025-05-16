import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/slices/authSlice";
import socket from "../socket";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Для отображения ошибок
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Проверка на пустые поля
    if (!email || !password) {
      setError("Заполните все поля.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(loginSuccess({ user: data.user }));
        socket.emit("user_connected", data.user);
        navigate("/home"); // Переход на главную страницу после входа
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Ошибка при входе");
      }
    } catch (error) {
      setError("Ошибка при подключении к серверу.");
      console.error("Ошибка при входе:", error.message);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Левая часть с фоном (картинка) */}
      <div
        className="w-1/1 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://via.placeholder.com/800x1200')",
        }}
      >
        {/* Можно заменить URL картинки на свою */}
      </div>

      {/* Правая часть с формой */}
      <div className="w-1/2 bg-black text-white flex flex-col justify-center items-center p-8">
        <h1 className="text-4xl font-semibold mb-4">Добро пожаловать!</h1>
        <p className="text-lg mb-8">Войдите в вашу учетную запись.</p>
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="input input-bordered p-3 w-full mb-4 bg-gray-700 text-white rounded-lg"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль"
            className="input input-bordered p-3 w-full mb-4 bg-gray-700 text-white rounded-lg"
          />
          <button
            type="submit"
            className="btn btn-primary w-full p-3 mt-4 rounded-lg"
          >
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
