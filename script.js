// Define Variables
let snake = [{ x: 10, y: 10 }]; // Position
let gridSize = 20;
let food = generateFood(); // Initialize food after gridSize is defined
let highScore = 0;
let direction = "right";
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;

// Define HTML elements
const gameBoard = document.getElementById("game-board");
const instructionText = document.getElementById("instruction-text");
const logo = document.getElementById("logo");
const score = document.getElementById("score");
const highScoreText = document.getElementById("highScore");

// Ensure gameBoard and other DOM elements are fully loaded
// document.addEventListener("DOMContentLoaded", (event) => {
//   drawParent(); // Now safe to call drawParent
// });

// Draw the map of the game, the snake and the food
function drawParent() {
  gameBoard.innerHTML = "";
  drawSnake();
  drawFood();
  updateScore();
}

// Draw snake
function drawSnake() {
  snake.forEach((seg) => {
    const snakeElement = createGameElement("div", "snake");
    setPosition(snakeElement, seg);
    gameBoard.appendChild(snakeElement);
  });
}

// Creating elements: snake, food or div/cube
function createGameElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

// Define the position on the board (snake || food)
function setPosition(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}

// Draw food function
function drawFood() {
  if (gameStarted) {
    const foodElement = createGameElement("div", "food");
    setPosition(foodElement, food);
    gameBoard.appendChild(foodElement);
  }
}

function generateFood() {
  const x = Math.floor(Math.random() * gridSize) + 1;
  const y = Math.floor(Math.random() * gridSize) + 1;
  return { x, y };
}

// Moving the osnake
function moveSnake() {
  const head = { ...snake[0] }; // Shadow Copy
  switch (direction) {
    case "right":
      head.x++;
      break;
    case "left":
      head.x--;
      break;
    case "up":
      head.y--;
      break;
    case "down":
      head.y++;
      break;
    default:
      break;
  }

  snake.unshift(head); // to insert head at start of array

  if (head.x === food.x && head.y === food.y) {
    food = generateFood();
    increaseSpeed();
    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
      moveSnake();
      checkCollision();
      drawParent();
    }, gameSpeedDelay);
  } else {
    snake.pop(); // To remove the last element of array
  }
}

function startGame() {
  gameStarted = true; // Keep tracking the running game
  instructionText.style.display = "none";
  logo.style.display = "none";
  gameInterval = setInterval(() => {
    moveSnake();
    checkCollision();
    drawParent();
  }, gameSpeedDelay);
}

// Keypress Listener
function handleKeyPress(event) {
  if (
    (!gameStarted && event.code === "Enter") ||
    (!gameStarted && event.key === "Enter")
  ) {
    startGame();
  } else {
    switch (event.key) {
      case "ArrowUp":
        direction = "up";
        break;
      case "ArrowDown":
        direction = "down";
        break;
      case "ArrowRight":
        direction = "right";
        break;
      case "ArrowLeft":
        direction = "left";
        break;
      default:
        break;
    }
  }
}

document.addEventListener("keydown", handleKeyPress);

function increaseSpeed() {
  console.log(gameSpeedDelay);
  if (gameSpeedDelay > 150) {
    gameSpeedDelay -= 5;
  } else if (gameSpeedDelay > 100) {
    gameSpeedDelay -= 3;
  } else if (gameSpeedDelay > 50) {
    gameSpeedDelay -= 2;
  } else if (gameSpeedDelay > 25) {
    gameSpeedDelay -= 1;
  }
}

function checkCollision() {
  const head = snake[0];
  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    resetGame();
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      resetGame();
    }
  }
};

function resetGame() {
  updateHighScore();
  stopGame();
  snake = [{ x: 10, y: 10 }];
  food = generateFood();
  direction = "right";
  gameSpeedDelay = 200;
  updateScore();
};

function updateScore() {
  const currentScore = snake.length - 1;
  score.textContent = currentScore.toString().padStart(3, "0");
};

function stopGame() {
  clearInterval(gameInterval);
  gameStarted = false;
  instructionText.style.display = "block";
};

function updateHighScore() {
  const currentScore = snake.length - 1;
  if (currentScore > highScore) {
    highScore = currentScore;
    highScoreText.textContent = highScore.toString().padStart(3, '0')
  }
  highScoreText.style.display = 'block';
};
