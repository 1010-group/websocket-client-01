import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

// SVG иконки
const User = (props) => (
  <svg {...props} className={`w-6 h-6 ${props.className || ""}`} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);

const Phone = (props) => (
  <svg {...props} className={`w-6 h-6 ${props.className || ""}`} fill="currentColor" viewBox="0 0 24 24">
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
  </svg>
);

const Lock = (props) => (
  <svg {...props} className={`w-6 h-6 ${props.className || ""}`} fill="currentColor" viewBox="0 0 24 24">
    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
  </svg>
);

const Image = (props) => (
  <svg {...props} className={`w-6 h-6 ${props.className || ""}`} fill="currentColor" viewBox="0 0 24 24">
    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
  </svg>
);

const Calendar = (props) => (
  <svg {...props} className={`w-6 h-6 ${props.className || ""}`} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
  </svg>
);

const FileText = (props) => (
  <svg {...props} className={`w-6 h-6 ${props.className || ""}`} fill="currentColor" viewBox="0 0 24 24">
    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
  </svg>
);

const ArrowRight = (props) => (
  <svg {...props} className={`w-5 h-5 ${props.className || ""}`} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
  </svg>
);

const ArrowLeft = (props) => (
  <svg {...props} className={`w-5 h-5 ${props.className || ""}`} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
  </svg>
);

const Check = (props) => (
  <svg {...props} className={`w-8 h-8 ${props.className || ""}`} fill="currentColor" viewBox="0 0 24 24">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
  </svg>
);

const steps = [
  { id: 1, title: "Основная информация", icon: <User /> },
  { id: 2, title: "Контактные данные", icon: <Phone /> },
  { id: 3, title: "Безопасность", icon: <Lock /> },
  { id: 4, title: "Дополнительно", icon: <Image /> },
];

const Register = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    image: "",
    description: "",
    birthDate: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Проверка уникальности username, phone, email
  const checkExists = async (field, value) => {
    if (!value) return false;
    try {
      const res = await fetch(
        `https://websocket-server-01.onrender.com/api/users/check?${field}=${encodeURIComponent(value)}`
      );
      if (res.status === 404) return false;
      const data = await res.json();
      return !!data.exists;
    } catch {
      return false;
    }
  };

  // Обработчик изменения инпутов
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  // Проверка перед переходом на следующий шаг
  const nextStep = async () => {
    setError("");
    // Шаг 1: username + email
    if (currentStep === 1) {
      if (!formData.username || !formData.email) {
        setError("Заполните все поля");
        return;
      }
      const usernameExists = await checkExists("username", formData.username);
      const emailExists = await checkExists("email", formData.email);
      let err = "";
      if (usernameExists) err += "Имя пользователя уже занято. ";
      if (emailExists) err += "Email уже зарегистрирован. ";
      if (err) {
        setError(err.trim());
        return; // Блокируем переход!
      }
    }
    // Шаг 2: phone + fullName
    if (currentStep === 2) {
      if (!formData.phone || !formData.fullName) {
        setError("Заполните все поля");
        return;
      }
      const phoneExists = await checkExists("phone", formData.phone);
      if (phoneExists) {
        setError("Такой номер уже зарегистрирован");
        return; // Блокируем переход!
      }
    }
    // Шаг 3: password + confirmPassword
    if (currentStep === 3) {
      if (!formData.password || !formData.confirmPassword) {
        setError("Заполните поля пароля");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Пароли не совпадают");
        return;
      }
      if (formData.password.length < 6) {
        setError("Пароль должен содержать минимум 6 символов");
        return;
      }
    }
    // Шаг 4: birthDate + image/description
    if (currentStep === 4) {
      if (!formData.birthDate) {
        setError("Укажите дату рождения");
        return;
      }
    }
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    setError("");
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    // Проверка на уникальность перед отправкой
    let err = "";
    const usernameExists = await checkExists("username", formData.username);
    const emailExists = await checkExists("email", formData.email);
    const phoneExists = await checkExists("phone", formData.phone);
    if (usernameExists) err += "Имя пользователя уже занято. ";
    if (emailExists) err += "Email уже зарегистрирован. ";
    if (phoneExists) err += "Такой номер уже зарегистрирован. ";
    if (err) {
      setError(err.trim());
      return;
    }
    if (!formData.password || !formData.confirmPassword) {
      setError("Заполните поля пароля");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }
    if (formData.password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов");
      return;
    }
    if (!formData.birthDate) {
      setError("Укажите дату рождения");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://websocket-server-01.onrender.com/api/users/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();

      if (response.ok) {
        navigate("/login");
      } else {
        const message =
          typeof data.error === "string"
            ? data.error
            : data.message ||
            (data.errors
              ? Object.values(data.errors).join(", ")
              : "Произошла ошибка");
        setError(message);
      }
    } catch (err) {
      setError("Ошибка при регистрации: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Рендер шагов: по 2 инпута на шаг
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="text-gray-400" />
              </div>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Имя пользователя"
                className="w-full pl-12 pr-4 py-4 bg-[#18183a] text-white rounded-xl border-none outline-none focus:ring-2 focus:ring-cyan-400 placeholder-gray-400 text-lg transition-all duration-300"
                style={{
                  boxShadow:
                    formData.username
                      ? "0 0 16px 2px #0ea5e9aa"
                      : "0 0 0 0 transparent",
                }}
                autoComplete="off"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full pl-12 pr-4 py-4 bg-[#18183a] text-white rounded-xl border-none outline-none focus:ring-2 focus:ring-cyan-400 placeholder-gray-400 text-lg transition-all duration-300"
                style={{
                  boxShadow: formData.email ? "0 0 16px 2px #0ea5e9aa" : "0 0 0 0 transparent",
                }}
                autoComplete="off"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Phone className="text-gray-400" />
              </div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Номер телефона"
                className="w-full pl-12 pr-4 py-4 bg-[#18183a] text-white rounded-xl border-none outline-none focus:ring-2 focus:ring-cyan-400 placeholder-gray-400 text-lg transition-all duration-300"
                style={{
                  boxShadow:
                    formData.phone
                      ? "0 0 16px 2px #0ea5e9aa"
                      : "0 0 0 0 transparent",
                }}
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="text-gray-400" />
              </div>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Полное имя"
                className="w-full pl-12 pr-4 py-4 bg-[#18183a] text-white rounded-xl border-none outline-none focus:ring-2 focus:ring-cyan-400 placeholder-gray-400 text-lg transition-all duration-300"
                style={{
                  boxShadow:
                    formData.fullName
                      ? "0 0 16px 2px #0ea5e9aa"
                      : "0 0 0 0 transparent",
                }}
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="text-gray-400" />
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Пароль"
                className="w-full pl-12 pr-4 py-4 bg-[#18183a] text-white rounded-xl border-none outline-none focus:ring-2 focus:ring-cyan-400 placeholder-gray-400 text-lg transition-all duration-300"
                style={{
                  boxShadow:
                    formData.password
                      ? "0 0 16px 2px #0ea5e9aa"
                      : "0 0 0 0 transparent",
                }}
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="text-gray-400" />
              </div>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Подтвердите пароль"
                className="w-full pl-12 pr-4 py-4 bg-[#18183a] text-white rounded-xl border-none outline-none focus:ring-2 focus:ring-pink-400 placeholder-gray-400 text-lg transition-all duration-300"
                style={{
                  boxShadow:
                    formData.confirmPassword
                      ? "0 0 16px 2px #ec4899aa"
                      : "0 0 0 0 transparent",
                }}
              />
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Calendar className="text-gray-400" />
              </div>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 bg-[#18183a] text-white rounded-xl border-none outline-none focus:ring-2 focus:ring-cyan-400 placeholder-gray-400 text-lg transition-all duration-300"
                style={{
                  boxShadow:
                    formData.birthDate
                      ? "0 0 16px 2px #0ea5e9aa"
                      : "0 0 0 0 transparent",
                }}
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Image className="text-gray-400" />
              </div>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="URL фото профиля (необязательно)"
                className="w-full pl-12 pr-4 py-4 bg-[#18183a] text-white rounded-xl border-none outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-400 text-lg transition-all duration-300"
                style={{
                  boxShadow:
                    formData.image
                      ? "0 0 16px 2px #a855f7aa"
                      : "0 0 0 0 transparent",
                }}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Левая часть - Прогресс и мотивация */}
      <div
        className="hidden lg:flex lg:w-2/3 relative overflow-hidden"
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
        <div className="relative z-10 flex flex-col justify-center items-center text-center max-w-2xl mx-auto px-8">
          <div className="mb-12">
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
              Присоединяйтесь
              <br /> к Сообществу
            </h1>
            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
              Создайте аккаунт за несколько простых шагов
            </p>
          </div>

          {/* Прогресс шагов */}
          <div className="w-full max-w-md mb-8">
            <div className="flex justify-between items-center mb-6 relative">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center relative z-10">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${currentStep >= step.id
                        ? "bg-gradient-to-r from-cyan-500 to-pink-500 text-white"
                        : "bg-gray-700 text-gray-400"
                        }`}
                      style={{
                        boxShadow:
                          currentStep >= step.id
                            ? "0 0 20px rgba(14, 165, 233, 0.5)"
                            : "none",
                      }}
                    >
                      {currentStep > step.id ? (
                        <Check className="w-6 h-6" />
                      ) : (
                        step.icon
                      )}
                    </div>
                    <span
                      className={`text-xs text-center ${currentStep >= step.id ? "text-white" : "text-gray-400"
                        }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {/* Линия между шагами */}
                  {index < steps.length - 1 && (
                    <div
                      className="absolute top-1/2"
                      style={{
                        left: `calc(${((index + 1) * 100) / steps.length}% - 24px)`,
                        width: `calc(${100 / steps.length}% - 24px)`,
                        height: "4px",
                        background: currentStep > step.id
                          ? "linear-gradient(90deg, #0ea5e9, #ec4899)"
                          : "#374151",
                        transform: "translateY(-50%)",
                        zIndex: 1,
                        borderRadius: "2px",
                      }}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Прогресс бар */}
            <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
              <div
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(currentStep / steps.length) * 100}%`,
                  background: "linear-gradient(90deg, #0ea5e9, #ec4899)",
                }}
              />
            </div>
            <p className="text-center text-gray-300">
              Шаг {currentStep} из {steps.length}
            </p>
          </div>

          <div className="text-gray-300">
            <p className="text-lg mb-4">🚀 Почти готово!</p>
            <p className="text-sm opacity-75">
              Заполните все поля для создания аккаунта
            </p>
          </div>
        </div>
      </div>

      {/* Правая часть - Форма */}
      <div
        className="w-full lg:w-1/3 flex items-center justify-center p-6 lg:p-12"
        style={{
          background:
            "linear-gradient(180deg, #1a1a3e 0%, #2d1b69 100%)",
        }}
      >
        <div className="w-full max-w-md">
          {/* Заголовок формы */}
          <div className="text-center mb-8">
            <div className="mb-6">{steps[currentStep - 1]?.icon}</div>
            <div className="relative mb-4">
              <div
                className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md border"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(14, 165, 233, 0.2), rgba(236, 72, 153, 0.2))",
                  border: "1px solid rgba(34, 211, 238, 0.3)",
                  boxShadow: "0 0 20px rgba(14, 165, 233, 0.3)",
                }}
              >
                <div
                  className="w-2 h-2 rounded-full mr-3 animate-pulse"
                  style={{
                    background: "linear-gradient(90deg, #0ea5e9, #ec4899)",
                    boxShadow: "0 0 10px rgba(14, 165, 233, 0.8)",
                  }}
                />
                <span className="text-cyan-300 font-semibold">
                  {currentStep}/{steps.length}
                </span>
                <span className="text-gray-300 mx-2">•</span>
                <span className="text-pink-300">
                  {Math.round((currentStep / steps.length) * 100)}% завершено
                </span>
              </div>
            </div>

            <h2
              className="text-3xl font-bold mb-6"
              style={{
                background:
                  "linear-gradient(90deg, #0ea5e9, #ec4899)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 2px 12px #0ea5e9aa)",
              }}
            >
              {steps[currentStep - 1]?.title}
            </h2>
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
            <form onSubmit={handleSubmit}>
              {renderStepContent()}
              {/* Сообщение об ошибке */}
              {error && (
                <div className="mt-6 p-4 bg-red-900 bg-opacity-50 backdrop-blur-sm border border-red-500 border-opacity-50 rounded-xl">
                  <p className="text-red-300 text-center font-medium">
                    ⚠️ {error}
                  </p>
                </div>
              )}

              {/* Кнопки навигации */}
              <div className="flex justify-between mt-8 space-x-4">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center space-x-2 px-6 py-3 rounded-xl font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 transition-all duration-300"
                  >
                    <ArrowLeft />
                    <span>Назад</span>
                  </button>
                )}

                <button
                  type={currentStep === steps.length ? "submit" : "button"}
                  onClick={currentStep === steps.length ? undefined : nextStep}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center space-x-2 p-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 active:scale-95"
                  style={{
                    background:
                      currentStep === steps.length
                        ? "linear-gradient(90deg, #10b981, #059669)"
                        : "linear-gradient(90deg, #0ea5e9, #a21caf, #ec4899)",
                    color: "#fff",
                    boxShadow: "0 8px 32px 0 #a21caf55",
                  }}
                >
                  <span>
                    {loading
                      ? "Загрузка..."
                      : currentStep === steps.length
                        ? "Создать аккаунт"
                        : "Далее"}
                  </span>
                  {currentStep === steps.length ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <ArrowRight />
                  )}
                </button>
              </div>
            </form>

            {/* Ссылка на вход */}
            <div className="text-center mt-6">
              <p className="text-gray-300">
                Уже есть аккаунт?{" "}
                <Link
                  to="/login"
                  className="text-cyan-400 hover:text-cyan-300 transition-all duration-300"
                >
                  Войти
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;