import React, { useState, useRef } from "react";
import { Phone, Lock, LogIn, Shield, Eye, EyeOff } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../redux/slices/authSlice"; // ✅ import your login action

const Login = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePosition({ x, y });
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!phone || !password) {
      setError("Заполните все поля.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("https://websocket-server-01.onrender.com/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Неверный номер или пароль");
        setIsLoading(false);
        return;
      }

      // ✅ Dispatch user to Redux
      dispatch(loginSuccess(data));

      // ✅ Navigate to home or chat
      navigate("/");

      setIsLoading(false);
    } catch (error) {
      console.error("Ошибка при входе:", error);
      setError("Произошла ошибка при входе.");
      setIsLoading(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Dynamic Background with Mouse Tracking */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Mouse-following gradient orb */}
        <div
          className="absolute w-96 h-96 rounded-full opacity-30 transition-all duration-700 ease-out"
          style={{
            left: `${mousePosition.x}%`,
            top: `${mousePosition.y}%`,
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, rgba(147, 51, 234, 0.2) 50%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />

        {/* Animated floating orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-80 h-80 bg-violet-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 left-40 w-64 h-64 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
        <div className="absolute bottom-40 right-10 w-72 h-72 bg-indigo-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }}
          />
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        {/* Left Side: Illustration */}
        <div className="hidden lg:flex lg:w-3/5 items-center justify-center p-12">
          <div
            className="max-w-lg text-center transform transition-all duration-700"
            style={{
              transform: `translate(${(mousePosition.x - 50) * 0.05}px, ${(mousePosition.y - 50) * 0.05}px)`,
            }}
          >
            <div className="mb-8">
              <div
                className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 rounded-3xl flex items-center justify-center shadow-2xl transition-transform duration-500 hover:scale-110 hover:rotate-3"
                style={{
                  boxShadow: `0 25px 50px -12px rgba(236, 72, 153, 0.4), 0 0 60px rgba(147, 51, 234, 0.3)`,
                }}
              >
                <Shield className="w-16 h-16 text-white" />
              </div>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Защищенный вход
            </h2>
            <p className="text-xl text-purple-200 leading-relaxed">
              Войдите в свою учетную запись и получите доступ к современному интерфейсу
            </p>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full lg:w-2/5 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            {/* Glassmorphism Card with Mouse Interaction */}
            <div
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl transition-all duration-500 hover:bg-white/10 hover:border-white/20"
              style={{
                transform: `translate(${(mousePosition.x - 50) * -0.02}px, ${(mousePosition.y - 50) * -0.02}px)`,
                boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 80px rgba(147, 51, 234, 0.1)`,
              }}
            >
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
                  Добро пожаловать!
                </h1>
                <p className="text-purple-200">Войдите в вашу учетную запись</p>
              </div>

              <div className="space-y-6">
                {/* Phone Input */}
                <div className="group">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                      <Phone className="h-5 w-5 text-purple-300 group-focus-within:text-pink-300 transition-colors duration-300" />
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Телефон"
                      className="w-full pl-12 pr-4 py-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400/50 focus:border-pink-300/30 transition-all duration-300 placeholder-purple-200/70 text-white text-sm font-medium shadow-lg hover:bg-white/10"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500/5 via-purple-500/5 to-indigo-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>
                </div>

                {/* Password Input */}
                <div className="group">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                      <Lock className="h-5 w-5 text-purple-300 group-focus-within:text-pink-300 transition-colors duration-300" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Пароль"
                      className="w-full pl-12 pr-12 py-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400/50 focus:border-pink-300/30 transition-all duration-300 placeholder-purple-200/70 text-white text-sm font-medium shadow-lg hover:bg-white/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center z-10 hover:scale-110 transition-transform duration-200"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-purple-300 hover:text-pink-300 transition-colors duration-200" />
                      ) : (
                        <Eye className="h-5 w-5 text-purple-300 hover:text-pink-300 transition-colors duration-200" />
                      )}
                    </button>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500/5 via-purple-500/5 to-indigo-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="relative overflow-hidden w-full py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl hover:scale-105 group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10 flex items-center gap-3">
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Вход...
                      </>
                    ) : (
                      <>
                        <LogIn className="h-5 w-5" />
                        Войти
                      </>
                    )}
                  </span>
                </button>

                {/* Error Message */}
                {error && (
                  <div
                    className="bg-red-500/10 backdrop-blur-md border border-red-400/20 text-red-200 px-6 py-4 rounded-xl text-sm text-center shadow-lg transform transition-all duration-300"
                    style={{
                      animation: 'shake 0.5s ease-in-out',
                    }}
                  >
                    {error}
                  </div>
                )}

                {/* Register Link */}
                <div className="text-center pt-6 border-t border-white/10">
                  <p className="text-purple-200/80 text-lg">
                    Нет аккаунта?{' '}
                    <button
                      type="button"
                      onClick={() => { navigate('/register') }}
                      className="text-pink-300 font-semibold hover:text-pink-200 transition-colors duration-300 underline decoration-pink-300/50 hover:decoration-pink-200/50 underline-offset-4"
                    >
                      Зарегистрироваться
                    </button>
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile Logo with Mouse Interaction */}
            <div
              className="lg:hidden text-center mt-8 transition-transform duration-500"
              style={{
                transform: `translate(${(mousePosition.x - 50) * 0.01}px, ${(mousePosition.y - 50) * 0.01}px)`,
              }}
            >
              <div className="inline-flex items-center space-x-3 text-purple-300">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg shadow-lg transition-transform duration-300 hover:scale-110" />
                <span className="font-semibold text-lg">Secure App</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .group:hover .absolute {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default Login;