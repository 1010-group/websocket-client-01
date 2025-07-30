import { useState, useRef } from "react";
import { Eye, EyeOff, User, Mail, Phone, Lock, Calendar, Image, FileText, ArrowRight, ArrowLeft, Check, UserPlus } from "lucide-react";

const Register = () => {
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

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePosition({ x, y });
    }
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async () => {
    setError(null);
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Пароли не совпадают");
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      if (formData.username && formData.fullName && formData.phone && formData.password) {
        alert("Регистрация прошла успешно!");
        // navigate("/login");
      } else {
        setError("Произошла ошибка при регистрации");
      }
      setIsLoading(false);
    }, 2000);
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.username && formData.fullName && formData.phone;
      case 2:
        return formData.password && formData.confirmPassword;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const InputField = ({ icon: Icon, type = "text", name, placeholder, value, onChange, required = false }) => (
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
        <Icon className="h-5 w-5 text-violet-300 group-focus-within:text-pink-300 transition-colors duration-300" />
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full pl-12 pr-4 py-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400/50 focus:border-pink-300/30 transition-all duration-300 placeholder-violet-200/70 text-white text-sm font-medium shadow-lg hover:bg-white/10 transform hover:scale-[1.02]"
      />
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500/5 via-purple-500/5 to-violet-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );

  const PasswordField = ({ name, placeholder, value, onChange, showPassword, toggleShow, required = false }) => (
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
        <Lock className="h-5 w-5 text-violet-300 group-focus-within:text-pink-300 transition-colors duration-300" />
      </div>
      <input
        type={showPassword ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full pl-12 pr-12 py-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400/50 focus:border-pink-300/30 transition-all duration-300 placeholder-violet-200/70 text-white text-sm font-medium shadow-lg hover:bg-white/10 transform hover:scale-[1.02]"
      />
      <button
        type="button"
        onClick={toggleShow}
        className="absolute inset-y-0 right-0 pr-4 flex items-center z-10 hover:scale-110 transition-transform duration-200"
      >
        {showPassword ? (
          <EyeOff className="h-5 w-5 text-violet-300 hover:text-pink-300 transition-colors duration-200" />
        ) : (
          <Eye className="h-5 w-5 text-violet-300 hover:text-pink-300 transition-colors duration-200" />
        )}
      </button>
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500/5 via-purple-500/5 to-violet-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );

  const TextAreaField = ({ name, placeholder, value, onChange, rows = 4 }) => (
    <div className="relative group">
      <div className="absolute top-4 left-4 pointer-events-none z-10">
        <FileText className="h-5 w-5 text-violet-300 group-focus-within:text-pink-300 transition-colors duration-300" />
      </div>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full pl-12 pr-4 py-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400/50 focus:border-pink-300/30 transition-all duration-300 placeholder-violet-200/70 text-white text-sm font-medium resize-none shadow-lg hover:bg-white/10 transform hover:scale-[1.02]"
      />
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500/5 via-purple-500/5 to-violet-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );

  const PrimaryButton = ({ onClick, disabled, children, className = "" }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`relative overflow-hidden bg-gradient-to-r from-pink-500 via-purple-500 to-violet-500 text-white py-4 px-8 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl hover:scale-105 group ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <span className="relative z-10 flex items-center gap-3">
        {children}
      </span>
    </button>
  );

  const SecondaryButton = ({ onClick, children, className = "" }) => (
    <button
      type="button"
      onClick={onClick}
      className={`relative overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 text-white py-4 px-8 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:bg-white/20 hover:scale-105 group ${className}`}
    >
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <span className="relative z-10 flex items-center gap-3">
        {children}
      </span>
    </button>
  );

  const StepIndicator = () => (
    <div 
      className="flex items-center justify-center mb-10 transition-transform duration-500"
      style={{
        transform: `translate(${(mousePosition.x - 50) * 0.02}px, ${(mousePosition.y - 50) * 0.02}px)`,
      }}
    >
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`relative w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-500 ${
            step === currentStep
              ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg scale-110'
              : step < currentStep
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
              : 'bg-white/10 backdrop-blur-md text-violet-200 border border-white/20'
          }`}>
            {step < currentStep ? (
              <Check className="h-6 w-6" />
            ) : (
              <span className="text-sm">{step}</span>
            )}
            {step === currentStep && (
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 animate-pulse opacity-30"></div>
            )}
          </div>
          {step < 3 && (
            <div className={`w-20 h-0.5 mx-3 transition-all duration-500 ${
              step < currentStep 
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg' 
                : 'bg-white/20'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-8">
      <div 
        className="text-center mb-10 transition-transform duration-500"
        style={{
          transform: `translate(${(mousePosition.x - 50) * 0.01}px, ${(mousePosition.y - 50) * 0.01}px)`,
        }}
      >
        <h2 className="text-3xl font-bold text-white mb-3 bg-gradient-to-r from-pink-300 to-violet-300 bg-clip-text text-transparent">
          Основная информация
        </h2>
        <p className="text-violet-200/80 text-lg">Давайте начнем с основных данных</p>
      </div>

      <InputField
        icon={User}
        name="username"
        placeholder="Имя пользователя"
        value={formData.username}
        onChange={handleChange}
        required
      />

      <InputField
        icon={Mail}
        name="fullName"
        placeholder="Полное имя"
        value={formData.fullName}
        onChange={handleChange}
        required
      />

      <InputField
        icon={Phone}
        type="tel"
        name="phone"
        placeholder="Номер телефона"
        value={formData.phone}
        onChange={handleChange}
        required
      />

      <div className="pt-6">
        <PrimaryButton
          onClick={nextStep}
          disabled={!validateStep(1)}
          className="w-full"
        >
          Продолжить
          <ArrowRight className="h-5 w-5" />
        </PrimaryButton>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-8">
      <div 
        className="text-center mb-10 transition-transform duration-500"
        style={{
          transform: `translate(${(mousePosition.x - 50) * 0.01}px, ${(mousePosition.y - 50) * 0.01}px)`,
        }}
      >
        <h2 className="text-3xl font-bold text-white mb-3 bg-gradient-to-r from-pink-300 to-violet-300 bg-clip-text text-transparent">
          Безопасность
        </h2>
        <p className="text-violet-200/80 text-lg">Создайте надежный пароль для защиты аккаунта</p>
      </div>

      <PasswordField
        name="password"
        placeholder="Пароль"
        value={formData.password}
        onChange={handleChange}
        showPassword={showPassword}
        toggleShow={() => setShowPassword(!showPassword)}
        required
      />

      <PasswordField
        name="confirmPassword"
        placeholder="Подтвердите пароль"
        value={formData.confirmPassword}
        onChange={handleChange}
        showPassword={showConfirmPassword}
        toggleShow={() => setShowConfirmPassword(!showConfirmPassword)}
        required
      />

      <div className="flex gap-4 pt-6">
        <SecondaryButton onClick={prevStep} className="flex-1">
          <ArrowLeft className="h-5 w-5" />
          Назад
        </SecondaryButton>
        <PrimaryButton
          onClick={nextStep}
          disabled={!validateStep(2)}
          className="flex-1"
        >
          Продолжить
          <ArrowRight className="h-5 w-5" />
        </PrimaryButton>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-8">
      <div 
        className="text-center mb-10 transition-transform duration-500"
        style={{
          transform: `translate(${(mousePosition.x - 50) * 0.01}px, ${(mousePosition.y - 50) * 0.01}px)`,
        }}
      >
        <h2 className="text-3xl font-bold text-white mb-3 bg-gradient-to-r from-pink-300 to-violet-300 bg-clip-text text-transparent">
          Дополнительная информация
        </h2>
        <p className="text-violet-200/80 text-lg">Эти поля необязательны, но помогут создать полный профиль</p>
      </div>

      <InputField
        icon={Image}
        name="image"
        placeholder="Ссылка на изображение профиля"
        value={formData.image}
        onChange={handleChange}
      />

      <TextAreaField
        name="description"
        placeholder="Расскажите о себе..."
        value={formData.description}
        onChange={handleChange}
        rows={4}
      />

      <InputField
        icon={Calendar}
        type="date"
        name="birthDate"
        placeholder="Дата рождения"
        value={formData.birthDate}
        onChange={handleChange}
      />

      <div className="flex gap-4 pt-6">
        <SecondaryButton onClick={prevStep} className="flex-1">
          <ArrowLeft className="h-5 w-5" />
          Назад
        </SecondaryButton>
        <PrimaryButton
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Создание...
            </>
          ) : (
            <>
              <UserPlus className="h-5 w-5" />
              Создать аккаунт
            </>
          )}
        </PrimaryButton>
      </div>
    </div>
  );

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden p-4 flex items-center justify-center"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Dynamic Mouse-Following Background */}
      <div className="absolute inset-0">
        {/* Main mouse-following orb */}
        <div 
          className="absolute w-[600px] h-[600px] rounded-full opacity-40 transition-all duration-700 ease-out"
          style={{
            left: `${mousePosition.x}%`,
            top: `${mousePosition.y}%`,
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.4) 0%, rgba(147, 51, 234, 0.3) 30%, rgba(99, 102, 241, 0.2) 60%, transparent 80%)',
            filter: 'blur(80px)',
            scale: isHovering ? '1.2' : '1',
          }}
        />
        
        {/* Secondary interactive orb */}
        <div 
          className="absolute w-96 h-96 rounded-full opacity-30 transition-all duration-1000 ease-out"
          style={{
            left: `${100 - mousePosition.x}%`,
            top: `${100 - mousePosition.y}%`,
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, rgba(236, 72, 153, 0.2) 50%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />

        {/* Static floating orbs with mouse interaction */}
        <div 
          className="absolute top-10 left-10 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse transition-transform duration-1000"
          style={{
            transform: `translate(${(mousePosition.x - 50) * 0.1}px, ${(mousePosition.y - 50) * 0.1}px)`,
          }}
        />
        <div 
          className="absolute top-40 right-20 w-80 h-80 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse transition-transform duration-1000"
          style={{
            animationDelay: '2s',
            transform: `translate(${(mousePosition.x - 50) * -0.08}px, ${(mousePosition.y - 50) * -0.08}px)`,
          }}
        />
        <div 
          className="absolute bottom-20 left-40 w-72 h-72 bg-violet-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse transition-transform duration-1000"
          style={{
            animationDelay: '4s',
            transform: `translate(${(mousePosition.x - 50) * 0.06}px, ${(mousePosition.y - 50) * 0.06}px)`,
          }}
        />
        <div 
          className="absolute bottom-40 right-10 w-64 h-64 bg-indigo-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse transition-transform duration-1000"
          style={{
            animationDelay: '1s',
            transform: `translate(${(mousePosition.x - 50) * -0.04}px, ${(mousePosition.y - 50) * -0.04}px)`,
          }}
        />
      </div>

      {/* Mesh gradient overlay with mouse interaction */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-violet-600/10 transition-opacity duration-500"
        style={{
          opacity: isHovering ? 0.8 : 0.6,
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-purple-900/30 to-black/50"></div>

      {/* Grid pattern that responds to mouse */}
      <div 
        className="absolute inset-0 opacity-5 transition-opacity duration-500"
        style={{
          opacity: isHovering ? 0.1 : 0.05,
        }}
      >
        <div 
          className="w-full h-full transition-transform duration-1000"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: '50px 50px',
            transform: `translate(${(mousePosition.x - 50) * 0.02}px, ${(mousePosition.y - 50) * 0.02}px)`,
          }}
        />
      </div>

      {/* Main content with parallax effect */}
      <div 
        className="relative z-10 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-10 max-w-lg w-full transition-all duration-500 hover:bg-white/8 hover:border-white/20"
        style={{
          transform: `translate(${(mousePosition.x - 50) * -0.03}px, ${(mousePosition.y - 50) * -0.03}px)`,
          boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 100px rgba(147, 51, 234, ${isHovering ? '0.3' : '0.1'})`,
        }}
      >
        <div 
          className="text-center mb-12 transition-transform duration-500"
          style={{
            transform: `translate(${(mousePosition.x - 50) * 0.01}px, ${(mousePosition.y - 50) * 0.01}px)`,
          }}
        >
          <div 
            className="relative w-20 h-20 bg-gradient-to-r from-pink-500 via-purple-500 to-violet-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl transition-transform duration-500 hover:scale-110"
            style={{
              transform: `rotate(${(mousePosition.x - 50) * 0.1}deg)`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-violet-500 rounded-3xl blur-lg opacity-50 animate-pulse"></div>
            <UserPlus className="relative h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-pink-300 via-purple-300 to-violet-300 bg-clip-text text-transparent">
            Регистрация
          </h1>
          <p className="text-violet-200/80 text-lg">Создайте новый аккаунт</p>
        </div>

        <StepIndicator />

        <div className="space-y-8">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          {error && (
            <div 
              className="bg-red-500/10 backdrop-blur-md border border-red-400/20 text-red-200 px-6 py-4 rounded-xl text-sm text-center shadow-lg transition-all duration-300"
              style={{
                animation: 'shake 0.5s ease-in-out',
              }}
            >
              {error}
            </div>
          )}

          <div 
            className="text-center pt-8 border-t border-white/10 transition-transform duration-500"
            style={{
              transform: `translate(${(mousePosition.x - 50) * 0.005}px, ${(mousePosition.y - 50) * 0.005}px)`,
            }}
          >
            <p className="text-violet-200/80 text-lg">
              Уже есть аккаунт?{' '}
              <button
                type="button"
                onClick={() => {/* navigate('/login') */}}
                className="text-pink-300 font-semibold hover:text-pink-200 transition-colors duration-300 underline decoration-pink-300/50 hover:decoration-pink-200/50 underline-offset-4"
              >
                Войти
              </button>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
};

export default Register;