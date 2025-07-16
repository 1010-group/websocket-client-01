import React, { useEffect, useState } from "react";

const COLS = 10;
const ROWS = 15;
const SPEED = 500;

const SHAPES = {
  I: [[1, 1, 1, 1]],
  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
  ],
  L: [
    [1, 0, 0],
    [1, 1, 1],
  ],
  J: [
    [0, 0, 1],
    [1, 1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
  ],
};

const COLORS = {
  I: "bg-cyan-400",
  O: "bg-yellow-300",
  T: "bg-purple-400",
  L: "bg-orange-400",
  J: "bg-blue-400",
  S: "bg-green-400",
  Z: "bg-red-400",
};

const randomShape = () => {
  const keys = Object.keys(SHAPES);
  const type = keys[Math.floor(Math.random() * keys.length)];
  return { type, shape: SHAPES[type], color: COLORS[type] };
};

const rotate = (matrix) => matrix[0].map((_, i) => matrix.map(row => row[i]).reverse());

export default function TetrisGame() {
  const [grid, setGrid] = useState(
    Array.from({ length: ROWS }, () => Array(COLS).fill(""))
  );
  const [current, setCurrent] = useState(randomShape());
  const [pos, setPos] = useState({ x: 3, y: 0 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTime((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const merge = (newGrid, shape, pos, color) => {
    shape.forEach((row, y) =>
      row.forEach((val, x) => {
        if (val && newGrid[y + pos.y]?.[x + pos.x] !== undefined) {
          newGrid[y + pos.y][x + pos.x] = color;
        }
      })
    );
    return newGrid;
  };

  const collide = (grid, shape, pos) => {
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (
          shape[y][x] &&
          (
            !grid[y + pos.y] ||
            grid[y + pos.y][x + pos.x] === undefined ||
            grid[y + pos.y][x + pos.x] !== ""
          )
        ) {
          return true;
        }
      }
    }
    return false;
  };

  const clearLines = (newGrid) => {
    const updated = newGrid.filter(row => row.some(cell => cell === ""));
    while (updated.length < ROWS) updated.unshift(Array(COLS).fill(""));
    setScore((s) => s + (ROWS - updated.length) * 100);
    return updated;
  };

  const drop = () => {
    if (gameOver) return;
    const newPos = { x: pos.x, y: pos.y + 1 };
    if (!collide(grid, current.shape, newPos)) {
      setPos(newPos);
    } else {
      let newGrid = merge(
        grid.map((r) => [...r]),
        current.shape,
        pos,
        current.color
      );
      newGrid = clearLines(newGrid);
      setGrid(newGrid);

      const next = randomShape();
      if (collide(newGrid, next.shape, { x: 3, y: 0 })) {
        setGameOver(true);
      } else {
        setCurrent(next);
        setPos({ x: 3, y: 0 });
      }
    }
  };

  const move = (dir) => {
    if (!gameOver && !collide(grid, current.shape, { x: pos.x + dir, y: pos.y })) {
      setPos({ x: pos.x + dir, y: pos.y });
    }
  };

  const rotateShape = () => {
    if (gameOver) return;
    const rotated = rotate(current.shape);
    if (!collide(grid, rotated, pos)) {
      setCurrent({ ...current, shape: rotated });
    }
  };

  useEffect(() => {
    const interval = setInterval(drop, SPEED);
    return () => clearInterval(interval);
  });

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowLeft") move(-1);
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowDown") drop();
      if (e.key === "ArrowUp") rotateShape();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  const displayGrid = () => {
    const newGrid = grid.map((r) => [...r]);
    current.shape.forEach((row, y) =>
      row.forEach((val, x) => {
        if (val && newGrid[y + pos.y]?.[x + pos.x] !== undefined) {
          newGrid[y + pos.y][x + pos.x] = current.color;
        }
      })
    );
    return newGrid;
  };

  return (
    <div className="flex flex-col items-center justify-center bg-black min-h-screen text-white">
      <h1 className="text-3xl font-bold text-purple-400 mb-2">🎮 Мини-Тетрис</h1>
      <h2 className="text-lg mb-4">🎯 Счет: {score} | ⏱️ Время: {time} сек</h2>
      {gameOver && <h2 className="text-red-500 font-bold mb-4">Игра окончена!</h2>}

      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${COLS}, 1.8rem)`,
          gridTemplateRows: `repeat(${ROWS}, 1.8rem)`,
          gap: "2px",
          backgroundColor: "gray",
          padding: "4px",
        }}
      >
        {displayGrid().map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${y}-${x}`}
              className={`border border-gray-800 ${cell || "bg-black"}`}
            ></div>
          ))
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
