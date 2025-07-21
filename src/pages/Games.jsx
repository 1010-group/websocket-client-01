import React from "react";
import { useNavigate } from "react-router-dom";

const games = [
  {
    id: "tetris",
    title: "Мини-Тетрис",
    description: "Классическая игра Тетрис с уровнями и счетом.",
    image: "/tetris.png",
    route: "/game/tetris",
  },
  {
    id: "snake",
    title: "Змейка",
    description: "Управляй змейкой и ешь яблоки!",
    image: "/Snake.png",
    route: "/game/snake",
  },
  {
  id: "pong",
  title: "Понг",
  description: "Две ракетки, мячик отскакивает от стенок.",
  image: "/pong.png",    // свой путь к превью
  route: "/game/pong",
}

];

export default function GamesList() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 px-4 py-10">
      <h1 className="text-4xl font-bold mb-8 text-purple-400">🎮 Игры</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl">
        {games.map((game) => (
          <div
            key={game.id}
            className="bg-base-300 rounded-2xl shadow-xl p-4 flex flex-col items-center"
          >
            <img
              src={game.image}
              alt={game.title}
              className="rounded-xl mb-4 w-full h-48 object-cover"
            />
            <h2 className="text-xl font-bold mb-1 text-purple-300">{game.title}</h2>
            <p className="text-gray-400 text-center text-sm mb-4">{game.description}</p>
            <button
              onClick={() => navigate(game.route)}
              className="btn btn-primary w-full"
            >
              Играть
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
