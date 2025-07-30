import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, User, Info, Lock } from "lucide-react";
import Aurora from "../Components/ReactBits/Aurora";


const Register = () => {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    phone: "",
    password: "",
    confirmPassword: "",
    image: "",
    description: "",
    birthDate: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    setError(null);
    if (currentStep === 1) {
      if (!formData.username.trim() || !formData.phone.trim()) {
        setError("Пожалуйста, заполните все обязательные поля");
        return;
      }
    }
    if (currentStep === 2) {
      if (!formData.birthDate.trim() || !formData.image.trim()) {
        setError("Укажите дату рождения и фото профиля");
        return;
      }
    }
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    setError(null);
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }
    if (!formData.password.trim()) {
      setError("Пожалуйста, введите пароль");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        navigate("/login");
      } else {
        const message =
          typeof data.error === "string"
            ? data.error
            : data.message || (data.errors ? Object.values(data.errors).join(", ") : "Произошла ошибка");
        setError(message);
      }
    } catch (err) {
      setError("Ошибка при регистрации: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepIcon = (step) => {
    switch (step) {
      case 1: return <User className="w-5 h-5" />;
      case 2: return <Info className="w-5 h-5" />;
      case 3: return <Lock className="w-5 h-5" />;
      default: return null;
    }
  };

  const getStepTitle = () => {
    return ["Основная информация", "Дополнительная информация", "Безопасность"][currentStep - 1];
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label className="label">
                <span className="label-text font-medium">Имя пользователя *</span>
              </label>
              <input type="text" name="username" value={formData.username} onChange={handleChange}
                placeholder="Username" className="input input-bordered input-primary w-full" required />
            </div>
            <div>
              <label className="label">
                <span className="label-text font-medium">Номер телефона *</span>
              </label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                placeholder="+998 90 123 45 67"
                pattern="^\+998\d{9}$"
                title="Введите номер в формате +998XXXXXXXXX"
                className="input input-bordered input-primary w-full" required />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="label">
                <span className="label-text font-medium">Полное имя</span>
              </label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange}
                placeholder="Иван Иванов" className="input input-bordered input-secondary w-full" />
            </div>
            <div>
              <label className="label">
                <span className="label-text font-medium">Дата рождения</span>
              </label>
              <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange}
                className="input input-bordered input-secondary w-full" />
            </div>
            <div>
              <label className="label">
                <span className="label-text font-medium">URL фото профиля</span>
              </label>
              <input type="url" name="image" value={formData.image} onChange={handleChange}
                placeholder="https://example.com/photo.jpg"
                className="input input-bordered input-secondary w-full" />
            </div>
            <div>
              <label className="label">
                <span className="label-text font-medium">Описание</span>
              </label>
              <textarea name="description" value={formData.description} onChange={handleChange}
                placeholder="Расскажите о себе..." rows="3"
                className="textarea textarea-bordered textarea-secondary w-full resize-none" />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div>
              <label className="label">
                <span className="label-text font-medium">Пароль *</span>
              </label>
              <input type="password" name="password" value={formData.password} onChange={handleChange}
                placeholder="Введите пароль" className="input input-bordered input-warning w-full" required />
            </div>
            <div>
              <label className="label">
                <span className="label-text font-medium">Подтверждение пароля *</span>
              </label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                placeholder="Повторите пароль" className="input input-bordered input-warning w-full" required />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row justify-center">
      <div className="absolute inset-0 -z-10">
        <Aurora
          colorStops={["blue", "red", "white",]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />

      </div>
      <div className="w-full  lg:w-1/2  rounded-lg  text-base-content flex flex-col justify-center items-center p-4 sm:p-10">

        <div className="w-full p-10   max-w-md backdrop-blur-xl  rounded-lg ">
          <h1 className="text-4xl font-semibold mb-2 text-center text-primary">Создайте аккаунт</h1>

          {/* Прогрессбар */}
          <div className="flex items-center justify-center mb-6">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                  ${step <= currentStep ? "bg-primary text-primary-content shadow-lg scale-110" : "bg-base-200 text-base-content/60"}`}>
                  {getStepIcon(step)}
                </div>
                {step < 3 && (
                  <div className={`w-12 h-1 mx-2 rounded-full transition-all duration-300
                    ${step < currentStep ? "bg-primary shadow-sm" : "bg-base-200"}`} />
                )}
              </div>
            ))}
          </div>

          <h2 className="text-xl font-medium mb-6 text-center text-secondary">{getStepTitle()}</h2>

          {error && <div className="alert alert-error mb-4 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>}

          <form onSubmit={handleSubmit} className=" p-6 rounded-lg shadow-lg">
            {renderStep()}

            <div className="flex justify-between mt-6">
              <button type="button" onClick={handlePrev} disabled={currentStep === 1}
                className={`btn btn-outline gap-2 ${currentStep === 1 ? "btn-disabled" : "btn-ghost hover:btn-neutral"}`}>
                <ChevronLeft className="w-4 h-4" />
                Назад
              </button>

              {currentStep < 3 ? (
                <button type="button" onClick={handleNext} className="btn btn-primary gap-2">
                  Далее <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button type="submit" className="btn btn-success gap-2" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Зарегистрироваться
                    </>
                  )}
                </button>
              )}
            </div>
          </form>

          <p className="text-center mt-6 text-base-content/70">
            Уже есть аккаунт?{" "}
            <button onClick={() => navigate("/login")} className="link link-primary link-hover font-medium">
              Войти
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;
