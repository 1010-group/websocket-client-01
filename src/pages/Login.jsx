import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/slices/authSlice";
import { useNavigate, Link } from "react-router-dom";
import socket from "../socket";
import { toast } from "react-toastify";
import Aurora from "../Components/ReactBits/Aurora";

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

    const loginURL =
      "https://websocket-server-01.onrender.com/api/users/login";

    try {
      const response = await fetch(loginURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });

      const data = await response.json();

      if (response.ok) {
        dispatch(loginSuccess({ user: data.user }));
        socket.emit("user_connected", data.user);
        toast.success("Успешный вход!");
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
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Фон Aurora */}
      <div className="absolute inset-0 -z-10">
        <Aurora
          colorStops={["blue", "red", "white"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
      </div>

      <div className="w-full max-w-md p-8 rounded-lg backdrop-blur-xl shadow-xl text-base-content bg-white/5">
        <h2 className="text-3xl font-semibold text-center mb-6 text-primary">
          Вход в аккаунт
        </h2>

        {error && (
          <div className="alert alert-error mb-4 shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label">
              <span className="label-text font-medium">Телефон</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+998 90 123 45 67"
              className="input input-bordered input-primary w-full"
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text font-medium">Пароль</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input input-bordered input-primary w-full"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full mt-2"
          >
            Войти
          </button>
        </form>

        <p className="mt-6 text-center text-base-content/70">
          Нет аккаунта?{" "}
          <Link to="/register" className="link link-primary font-medium">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
