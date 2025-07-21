// src/pages/SnakeGame.jsx
import React, { useRef, useEffect, useState } from "react";

export default function SnakeGame() {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [length, setLength] = useState(5);
  const [gameOver, setGameOver] = useState(false);

  const size = 20;
  const gridSize = 20;
  const tickDelay = 200; // 200 мс на шаг — медленно и удобно

  const snake = useRef([
    { x: 5, y: 10 },
    { x: 4, y: 10 },
    { x: 3, y: 10 },
    { x: 2, y: 10 },
    { x: 1, y: 10 }
  ]);

  const dir = useRef({ x: 1, y: 0 });
  const nextDir = useRef({ x: 1, y: 0 });
  const food = useRef(getRandomFood(snake.current));
  const eatSound = useRef(null);

  function getRandomFood(snakeArray) {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize)
      };
    } while (snakeArray.some((s) => s.x === newFood.x && s.y === newFood.y));
    return newFood;
  }

  const moveSnake = () => {
    dir.current = nextDir.current; // плавное управление

    const newHead = {
      x: snake.current[0].x + dir.current.x,
      y: snake.current[0].y + dir.current.y
    };

    // Столкновение со стеной
    if (
      newHead.x < 0 || newHead.x >= gridSize ||
      newHead.y < 0 || newHead.y >= gridSize
    ) {
      setGameOver(true);
      return;
    }

    // Столкновение с собой
    if (snake.current.slice(1).some((s) => s.x === newHead.x && s.y === newHead.y)) {
      setGameOver(true);
      return;
    }

    // Добавляем голову
    snake.current = [newHead, ...snake.current];

    // Еда?
    if (newHead.x === food.current.x && newHead.y === food.current.y) {
      setLength((prev) => prev + 1);
      setScore((prev) => prev + 10);
      eatSound.current?.play();
      food.current = getRandomFood(snake.current);
    } else {
      while (snake.current.length > length) {
        snake.current.pop();
      }
    }
  };

  const draw = (ctx) => {
    ctx.clearRect(0, 0, gridSize * size, gridSize * size);

    // фон
    ctx.fillStyle = "#aad751";
    ctx.fillRect(0, 0, gridSize * size, gridSize * size);

    // еда
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(
      food.current.x * size + size / 2,
      food.current.y * size + size / 2,
      size / 2,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // змейка
    for (let i = 0; i < snake.current.length; i++) {
      ctx.fillStyle = i === 0 ? "#4CAF50" : "#66BB6A";
      ctx.beginPath();
      ctx.arc(
        snake.current[i].x * size + size / 2,
        snake.current[i].y * size + size / 2,
        size / 2,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowUp" && dir.current.y === 0) nextDir.current = { x: 0, y: -1 };
      if (e.key === "ArrowDown" && dir.current.y === 0) nextDir.current = { x: 0, y: 1 };
      if (e.key === "ArrowLeft" && dir.current.x === 0) nextDir.current = { x: -1, y: 0 };
      if (e.key === "ArrowRight" && dir.current.x === 0) nextDir.current = { x: 1, y: 0 };
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");

    if (gameOver) return;

    const interval = setInterval(() => {
      moveSnake();
      if (!gameOver) {
        draw(ctx);
      }
    }, tickDelay);

    return () => clearInterval(interval);
  }, [gameOver]);

  const restart = () => {
    snake.current = [
      { x: 5, y: 10 },
      { x: 4, y: 10 },
      { x: 3, y: 10 },
      { x: 2, y: 10 },
      { x: 1, y: 10 }
    ];
    dir.current = { x: 1, y: 0 };
    nextDir.current = { x: 1, y: 0 };
    food.current = getRandomFood(snake.current);
    setScore(0);
    setLength(5);
    setGameOver(false);
  };

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-white py-4">
      <h1 className="text-3xl font-bold text-green-400 mb-2">🐍 Змейка</h1>
      <h2 className="mb-2">Очки: {score}</h2>
      <h2 className="mb-4">Длина: {length}</h2>
      {gameOver && <h2 className="text-red-500 mb-4">Игра окончена!</h2>}

      <canvas
        ref={canvasRef}
        width={gridSize * size}
        height={gridSize * size}
        style={{ border: "4px solid #4CAF50", backgroundColor: "#aad751" }}
      />

      {gameOver && (
        <button
          className="mt-4 px-4 py-2 bg-green-600 rounded hover:bg-green-700"
          onClick={restart}
        >
          Новая игра
        </button>
      )}

      <audio ref={eatSound} src="/eat.mp3" preload="auto" />
    </div>
  );
}
