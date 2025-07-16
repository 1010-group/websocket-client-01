import React, { useEffect, useState } from "react";

const COLS = 20;
const ROWS = 20;
const SPEED = 300; // медленнее

const getRandomFood = (snake) => {
  let newFood;
  do {
    newFood = {
      x: Math.floor(Math.random() * COLS),
      y: Math.floor(Math.random() * ROWS),
    };
  } while (snake.some((s) => s.x === newFood.x && s.y === newFood.y));
  return newFood;
};

export default function SnakeGame() {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [dir, setDir] = useState(null);
  const [food, setFood] = useState(getRandomFood([{ x: 10, y: 10 }]));
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const moveSnake = () => {
    if (gameOver || !dir) return; // не двигаемся если нет направления

    const newHead = {
      x: snake[0].x + dir.x,
      y: snake[0].y + dir.y,
    };

    // Проверка на столкновение
    if (
      newHead.x < 0 || newHead.x >= COLS ||
      newHead.y < 0 || newHead.y >= ROWS ||
      snake.some((s) => s.x === newHead.x && s.y === newHead.y)
    ) {
      setGameOver(true);
      return;
    }

    let newSnake = [newHead, ...snake];
    if (newHead.x === food.x && newHead.y === food.y) {
      setFood(getRandomFood(newSnake));
      setScore(score + 10);
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowUp" && (!dir || dir.y !== 1)) setDir({ x: 0, y: -1 });
      if (e.key === "ArrowDown" && (!dir || dir.y !== -1)) setDir({ x: 0, y: 1 });
      if (e.key === "ArrowLeft" && (!dir || dir.x !== 1)) setDir({ x: -1, y: 0 });
      if (e.key === "ArrowRight" && (!dir || dir.x !== -1)) setDir({ x: 1, y: 0 });
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [dir]);

  useEffect(() => {
    const interval = setInterval(moveSnake, SPEED);
    return () => clearInterval(interval);
  });

  return (
    <div className="flex flex-col items-center justify-center bg-black min-h-screen text-white">
      <h1 className="text-3xl font-bold text-green-400 mb-2">🐍 Змейка</h1>
      <h2 className="mb-4">Очки: {score}</h2>
      {gameOver && <h2 className="text-red-500 mb-4">Игра окончена!</h2>}

      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${COLS}, 1.5rem)`,
          gridTemplateRows: `repeat(${ROWS}, 1.5rem)`,
          gap: "1px",
          backgroundColor: "gray",
          padding: "4px",
        }}
      >
        {Array.from({ length: ROWS }).map((_, y) =>
          Array.from({ length: COLS }).map((_, x) => {
            const isSnake = snake.some((s) => s.x === x && s.y === y);
            const isFood = food.x === x && food.y === y;
            return (
              <div
                key={`${x}-${y}`}
                className={`border border-gray-800 ${
                  isSnake
                    ? "bg-green-400"
                    : isFood
                    ? "bg-red-400"
                    : "bg-black"
                }`}
              ></div>
            );
          })
        )}
      </div>

      {gameOver && (
        <button
          className="mt-4 px-4 py-2 bg-green-600 rounded hover:bg-green-700"
          onClick={() => window.location.reload()}
        >
          Новая игра
        </button>
      )}
    </div>
  );
}
