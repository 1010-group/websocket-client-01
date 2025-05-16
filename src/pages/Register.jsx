import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    profilePic: "",
    description: "",
    phone: "",
    birthDate: "",
  });

  const [error, setError] = useState(null); // Для отображения ошибок
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Сброс ошибки перед отправкой
    try {
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigate("/login");
      } else {
        const { error } = await response.json();
        setError(error);
      }
    } catch (err) {
      setError("Ошибка при регистрации: " + err.message);
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
        {/* Замените URL картинки на ваше собственное изображение */}
      </div>

      {/* Правая часть с формой */}
      <div className="w-1/2 bg-black text-white flex flex-col justify-center items-center p-8">
        <h1 className="text-4xl font-semibold mb-4">Создайте аккаунт</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg"
        >
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            className="input input-bordered p-3 w-full mb-4 bg-gray-700 text-white rounded-lg"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="input input-bordered p-3 w-full mb-4 bg-gray-700 text-white rounded-lg"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="input input-bordered p-3 w-full mb-4 bg-gray-700 text-white rounded-lg"
          />
          <input
            type="text"
            name="profilePic"
            value={formData.profilePic}
            onChange={handleChange}
            placeholder="Profile Picture URL"
            className="input input-bordered p-3 w-full mb-4 bg-gray-700 text-white rounded-lg"
          />
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="input input-bordered p-3 w-full mb-4 bg-gray-700 text-white rounded-lg"
          />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="input input-bordered p-3 w-full mb-4 bg-gray-700 text-white rounded-lg"
          />
          <input
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            className="input input-bordered p-3 w-full mb-4 bg-gray-700 text-white rounded-lg"
          />
          <button
            type="submit"
            className="btn btn-primary w-full p-3 mt-4 rounded-lg"
          >
            Зарегистрироваться
          </button>
        </form>
        <p className="text-center mt-4">
          Уже есть аккаунт?{" "}
          <Link to="/login" className="text-blue-500">
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
