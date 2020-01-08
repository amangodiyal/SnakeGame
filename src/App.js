import React, { useState, useRef, useEffect } from "react";
import { useInterval } from "./useInterval";
import {
  CANVAS_SIZE,
  SNAKE_START,
  APPLE_START,
  SCALE,
  SPEED,
  DIRECTIONS,
  MAX_SPEED
} from "./constants";

const App = () => {
  const canvasRef = useRef(null);
  const [snake, setSnake] = useState(SNAKE_START);
  const [apple, setApple] = useState(APPLE_START);
  const [dir, setDir] = useState([0, -1]);
  const [speed, setSpeed] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [gameStart, setGameStart] = useState(false);
  const [score, setScore] = useState(0);

  useInterval(() => gameLoop(), speed);

  const checkCollision = (head, snk = snake) => {
    if (
      head[0] * SCALE >= CANVAS_SIZE[0] ||
      head[0] <= 0 ||
      head[1] * SCALE >= CANVAS_SIZE[1] ||
      head[1] <= 0
    )
      return true;

    for (const piece of snk) {
      if (piece[0] === head[0] && piece[1] === head[1]) return true;
    }
    return false;
  };

  const endGame = () => {
    setSpeed(null);
    setGameOver(true);
    setGameStart(false);
  };

  const createApple = () => {
    return apple.map((val, i) =>
      Math.floor(Math.random() * (CANVAS_SIZE[i] / SCALE))
    );
  };

  const checkAppleCollision = snakeCopy => {
    if (snakeCopy[0][0] === apple[0] && snakeCopy[0][1] === apple[1]) {
      let newApple = createApple();
      //console.log(newApple);
      while (checkCollision(newApple, snakeCopy)) {
        newApple = createApple();
      }
      setScore(score + 1);
      setApple(newApple);
      setSpeed(speed - 20 <= MAX_SPEED ? MAX_SPEED : speed - 20);
      //console.log(apple);
      return true;
    }
    return false;
  };

  const gameLoop = () => {
    let snakeCopy = JSON.parse(JSON.stringify(snake));
    let newSnakeHead = [snakeCopy[0][0] + dir[0], snakeCopy[0][1] + dir[1]];
    snakeCopy.unshift(newSnakeHead);
    if (checkCollision(newSnakeHead)) endGame();
    if (!checkAppleCollision(snakeCopy)) snakeCopy.pop();
    setSnake(snakeCopy);
  };

  const moveSnake = ({ keyCode }) => {
    if (keyCode >= 37 && keyCode <= 40) {
      if ((dir[1] === -1 && keyCode === 40) || (dir[1] === 1 && keyCode === 38))
        return;
      if ((dir[0] === 1 && keyCode === 37) || (dir[0] === -1 && keyCode === 39))
        return;
      setDir(DIRECTIONS[keyCode]);
    }
  };

  const startGame = () => {
    setSnake(SNAKE_START);
    setApple(APPLE_START);
    setDir([0, -1]);
    setSpeed(SPEED);
    setGameStart(true);
    setGameOver(false);
    setScore(0);
  };

  useEffect(() => {
    //console.log("useEffect runs");
    //console.log(apple);
    const ctx = canvasRef.current.getContext("2d");
    ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0);
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.fillStyle = "pink";
    snake.forEach(([x, y]) => ctx.fillRect(x, y, 1, 1));
    ctx.fillStyle = "red";
    ctx.fillRect(apple[0], apple[1], 1, 1);
  }, [snake, apple, gameOver]);

  return (
    <div role="button" tabIndex="0" onKeyDown={e => moveSnake(e)}>
      <div>Score = {score} </div>
      <canvas
        style={{ border: "1px solid black", backgroundColor: "lightblue" }}
        ref={canvasRef}
        height={`${CANVAS_SIZE[0]}px`}
        width={`${CANVAS_SIZE[1]}px`}
      />
      {gameOver && <div>Game Over !! </div>}
      {!gameStart && <button onClick={() => startGame()}>Start Game</button>}
    </div>
  );
};

export default App;
