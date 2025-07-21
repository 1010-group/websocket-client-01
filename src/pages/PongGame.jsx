// src/pages/PongGame.jsx
import React, { useRef, useEffect, useState } from "react";

export default function PongGame() {
  const canvasRef = useRef(null);
  const [leftScore, setLeftScore] = useState(0);
  const [rightScore, setRightScore] = useState(0);

  const WIDTH = 600;
  const HEIGHT = 400;

  const paddleHeight = 80;
  const paddleWidth = 10;
  const ballSize = 10;

  const leftPaddleY = useRef(HEIGHT / 2 - paddleHeight / 2);
  const rightPaddleY = useRef(HEIGHT / 2 - paddleHeight / 2);

  const ball = useRef({
    x: WIDTH / 2,
    y: HEIGHT / 2,
    dx: 3,
    dy: 3
  });

  const keys = useRef({});

  useEffect(() => {
    const handleKeyDown = (e) => {
      keys.current[e.key] = true;
    };
    const handleKeyUp = (e) => {
      keys.current[e.key] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");

    const gameLoop = () => {
      // Move paddles
      if (keys.current["w"]) leftPaddleY.current -= 5;
      if (keys.current["s"]) leftPaddleY.current += 5;
      if (keys.current["ArrowUp"]) rightPaddleY.current -= 5;
      if (keys.current["ArrowDown"]) rightPaddleY.current += 5;

      // Bound paddles
      leftPaddleY.current = Math.max(0, Math.min(HEIGHT - paddleHeight, leftPaddleY.current));
      rightPaddleY.current = Math.max(0, Math.min(HEIGHT - paddleHeight, rightPaddleY.current));

      // Move ball
      ball.current.x += ball.current.dx;
      ball.current.y += ball.current.dy;

      // Top/Bottom wall bounce
      if (ball.current.y < 0 || ball.current.y > HEIGHT - ballSize) {
        ball.current.dy *= -1;
      }

      // Paddle collision
      if (
        ball.current.x < paddleWidth &&
        ball.current.y > leftPaddleY.current &&
        ball.current.y < leftPaddleY.current + paddleHeight
      ) {
        ball.current.dx *= -1;
        ball.current.x = paddleWidth; 
      }

      if (
        ball.current.x > WIDTH - paddleWidth - ballSize &&
        ball.current.y > rightPaddleY.current &&
        ball.current.y < rightPaddleY.current + paddleHeight
      ) {
        ball.current.dx *= -1;
        ball.current.x = WIDTH - paddleWidth - ballSize;
      }

      // Score
      if (ball.current.x < 0) {
        setRightScore((s) => s + 1);
        resetBall();
      } else if (ball.current.x > WIDTH) {
        setLeftScore((s) => s + 1);
        resetBall();
      }

      // Draw
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      // Middle line
      ctx.strokeStyle = "white";
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(WIDTH / 2, 0);
      ctx.lineTo(WIDTH / 2, HEIGHT);
      ctx.stroke();
      ctx.setLineDash([]);

      // Paddles
      ctx.fillStyle = "white";
      ctx.fillRect(0, leftPaddleY.current, paddleWidth, paddleHeight);
      ctx.fillRect(WIDTH - paddleWidth, rightPaddleY.current, paddleWidth, paddleHeight);

      // Ball
      ctx.fillRect(ball.current.x, ball.current.y, ballSize, ballSize);

      requestAnimationFrame(gameLoop);
    };

    const resetBall = () => {
      ball.current = {
        x: WIDTH / 2,
        y: HEIGHT / 2,
        dx: 3 * (Math.random() > 0.5 ? 1 : -1),
        dy: 3 * (Math.random() > 0.5 ? 1 : -1)
      };
    };

    resetBall();
    requestAnimationFrame(gameLoop);
  }, []);

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-white py-4">
      <h1 className="text-3xl font-bold text-purple-400 mb-2">🏓 Понг</h1>
      <h2 className="mb-4">
        {leftScore} : {rightScore}
      </h2>
      <canvas
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
        style={{ border: "4px solid white", backgroundColor: "black" }}
      />
    </div>
  );
}
