import { useState } from 'react';

export default function Header() {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className="flex justify-between items-center px-4 py-2 bg-[#0f1117]">
      {/* Левая часть */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Type here"
          className="px-3 py-1 rounded border border-purple-500 outline-none bg-gray-800 text-white"
        />
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1 rounded">
          submit
        </button>
      </div>

      {/* Правая часть */}
      <div className="flex gap-4 items-center">
        <button
          onClick={() => setShowRegister(true)}
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-1 rounded"
        >
          Register
        </button>
      </div>

      {/* Модалка */}
      {showRegister && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4 text-black">Регистрация</h2>

            <input
              type="text"
              placeholder="Username"
              className="w-full mb-3 px-3 py-2 border rounded text-black"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full mb-3 px-3 py-2 border rounded text-black"
            />

            <div className="flex justify-between">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={() => {
                  // TODO: тут будет твоя логика регистрации
                  console.log('Регистрация отправлена!');
                  setShowRegister(false);
                }}
              >
                Зарегистрироваться
              </button>
              <button
                className="text-gray-600 hover:text-black"
                onClick={() => setShowRegister(false)}
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}